/*jshint esversion: 6 */

var resources = require('./../../resources/model');
var   utils = require('./../../utils/utils.js');

let EventEmitter = require('events').EventEmitter;
//let emitter = new EventEmitter();

module.exports = class TempHumSensor extends EventEmitter {

constructor(params) {
 //   this.interval;  This is used with simulate.
 //       this.sensor;
  super();  
// const resources = require('./../../resources/model');  
    
//this.model = resources.pi.sensors;
  this.model = resources.pi.sensors;  
    
this.pluginName = 'Temperature & Humidity';
this.localParams = params;
}

start(params) {
 //   let localParams = params;
    if (this.localParams.simulate) {
        this.simulate();
    } else {
        this.connectHardware();
    }
}

stop(params) {
    if (params.simulate) {
        clearInterval(this.interval);
    } else {
        // sensor.unexport();
    }
    console.info('%s plugin stopped!', this.pluginName);
}

connectHardware() {
    let model = this.model;
    let emit = TempHumSensor.emit();
    var sensorDriver = require('node-dht-sensor');
    var sensor = {
        initialize: function () {
            return sensorDriver.initialize(22, this.model.temperature.gpio); //#A
        },
        read: function () {
            var readout = sensorDriver.read(); //#B
            //  Values in resources Object are updated here:
            model.temperature.value = parseFloat(readout.temperature.toFixed(2));
            emit('tempEvent');
            this.model.humidity.value = parseFloat(readout.humidity.toFixed(2)); //#C
            this.emit('humidityEvent');
            this.showValue();

            setTimeout(function () {
                sensor.read(); //#D     //  The function call itself;  setTimeout determines the loop rate.
            }, this.localParams.frequency);
        }
    };
    if (sensor.initialize()) {
        console.info('Hardware %s sensor started!', this.pluginName);
        sensor.read();
    } else {
        console.warn('Failed to initialize sensor!');
    }
}

simulate() {
    let model = this.model;
//    let emitter = this.emit();
    let interval = setInterval((function () {
        model.temperature.value = utils.randomInt(0, 40);
        this.emit('tempEvent');
        model.humidity.value = utils.randomInt(0, 100);
        this.emit('humidityEvent');
        this.showValue();
    }).bind(this), this.localParams.frequency);  ///   !!!NOTE THE bind() FUNCTION HERE!!!
    console.info('Simulated %s sensor started!', this.pluginName);
}

showValue() {
    console.info('Temperature: %s C, humidity %s \%',
        this.model.temperature.value, this.model.humidity.value);
}

};
//#A Initialize the driver for DHT22 on GPIO 12 (as specified in the model)
//#B Fetch the values from the sensors
//#C Update the model with the new temperature and humidity values; note that all observers will be notified
//#D Because the driver doesn’t provide interrupts, you poll the sensors for new values on a regular basis with a regular timeout function and set sensor.read() as a callback
