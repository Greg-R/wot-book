/*jshint esversion: 6 */

//  This module transforms the original PIR module into an Object.

var resources = require('./../../resources/model');

//  This class will emit data events.  Require and inherit EventEmitter.
let EventEmitter = require('events').EventEmitter;

module.exports = class PIRsensor extends EventEmitter {

    constructor(params) {
        this.interval = undefined;
        this.sensor = undefined;
        this.model = resources.pi.sensors.pir;
        this.pluginName = resources.pi.sensors.pir.name;
        this.params = params; // { simulate: false, frequency: 1000}
    }

    start(params) { //#A
        if (this.params.simulate) {
            this.simulate();
        } else {
            this.connectHardware();
        }
    }

    stop() { //#A
        if (this.params.simulate) {
            clearInterval(this.interval);
        } else {
            this.sensor.unexport();
        }
        console.info('%s plugin stopped!', this.pluginName);
    }

    connectHardware() { //#B
        var Gpio = require('onoff').Gpio;
        this.sensor = new Gpio(this.model.gpio, 'in', 'both'); //#C
        this.sensor.watch(function (err, value) { //#D
            if (err) exit(err);
            this.model.value = !!value;
            this.showValue();
        });
        console.info('Hardware %s sensor started!', this.pluginName);
    }

    simulate() { //#E
        this.interval = setInterval(function () {
            this.model.value = !this.model.value;
            this.showValue();
        }, this.params.frequency);
        console.info('Simulated %s sensor started!', this.pluginName);
    }

    showValue() {
        console.info(this.model.value ? 'there is someone!' : 'not anymore!');
    }

};

//#A starts and stops the plugin, should be accessible from other Node.js files so we export them
//#B require and connect the actual hardware driver and configure it
//#C configure the GPIO pin to which the PIR sensor is connected
//#D start listening for GPIO events, the callback will be invoked on events
//#E allows the plugin to be in simulation mode. This is very useful when developing or when you want to test your code on a device with no sensors connected, such as your laptop.
