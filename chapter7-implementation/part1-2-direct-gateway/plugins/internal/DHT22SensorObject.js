/*jshint esversion: 6 */
//  This module transforms the original sensor module into an Object.

var resources = require('./../../resources/model');
var utils = require('./../../utils/utils.js');

//  The sensor object will emit data events.  Require and inherit EventEmitter.
let EventEmitter = require('events').EventEmitter;

module.exports = class TempHumSensor extends EventEmitter {

    constructor(params) {
        super();
        this.model = resources.pi.sensors;
        this.pluginName = 'Temperature & Humidity';
        this.localParams = params;
    }

    start() {
        if (this.localParams.simulate) {
            this.simulate();
        } else {
            this.connectHardware();
        }
    }

    //  This method is not completed.
    stop(params) {
        if (params.simulate) {
            clearInterval(this.interval);
        } else {
            // sensor.unexport();
        }
        console.info('%s plugin stopped!', this.pluginName);
    }

    connectHardware() {
        var sensorDriver = require('node-dht-sensor');
        var sensor = {
            initialize: (function () {
                return sensorDriver.initialize(22, this.model.temperature.gpio); //#A
            }).bind(this), //  !!!NOTE the bind() FUNCTION HERE!
            read: (function () {
                    var readout = sensorDriver.read(); //#B
                    //  Values in resources Object are updated here:
                    this.model.temperature.value = parseFloat(readout.temperature.toFixed(2));
                    this.emit('tempEvent'); //  The Object inherits from EventEmitter, so it can "emit".
                    this.model.humidity.value = parseFloat(readout.humidity.toFixed(2)); //#C
                    this.emit('humidityEvent');
                    this.showValue();
                    setTimeout(function () {
                        sensor.read(); //#D  The function call itself;  setTimeout determines the loop rate.
                    }, this.localParams.frequency);
                }).bind(this) //  !!!NOTE the bind() FUNCTION HERE!
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
        let interval = setInterval((function () {
            model.temperature.value = utils.randomInt(0, 40);
            this.emit('tempEvent');
            model.humidity.value = utils.randomInt(0, 100);
            this.emit('humidityEvent');
            this.showValue();
        }).bind(this), this.localParams.frequency); ///   !!!NOTE THE bind() FUNCTION HERE!!!
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
//#D Because the driver doesn’t provide interrupts, you poll the sensors for new values on a regular basis
//   with a regular timeout function and set sensor.read() as a callback
