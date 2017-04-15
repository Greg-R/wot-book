/*jshint esversion: 6 */

//  This module transforms the original LED module into an Object.

var resources = require('./../../resources/model');

//  This class will emit data events.  Require and inherit EventEmitter.
let EventEmitter = require('events').EventEmitter;

module.exports = class LedController extends EventEmitter {

    constructor(params) {
        super();
        this.interval = undefined;
        this.actuator = undefined;
        this.model = resources.pi.actuators.leds['1'];
        this.pluginName = this.model.name;
        this.params = params; // { simulate: false, frequency: 1000}
    }

    start(params) {
        //  observe(model); //#A
        if (this.params.simulate) {
            this.simulate();
        } else {
            this.connectHardware();
        }
    }

    /*stop() {
        if (this.params.simulate) {
    //        clearInterval(interval);
        } else {
            actuator.unexport();
        }
        console.info('%s plugin stopped!', pluginName);
    }*/

    /*function observe(what) {
        Object.observe(what, function (changes) {
            console.info('Change detected by plugin for %s...', pluginName);
            switchOnOff(model.value); //#B
        });
    }*/

    switchOnOff(value) {
        if (!this.params.simulate) {
            this.actuator.write(value === true ? 1 : 0, function () { //#C
                console.info('Changed value of %s to %s', this.pluginName, value);
            });
        }
    }

    connectHardware() {
        var Gpio = require('onoff').Gpio;
        this.actuator = new Gpio(this.model.gpio, 'out'); //#D
        console.info('Hardware %s actuator started!', this.pluginName);
    }

    simulate() {
        this.interval = setInterval(function () {
            // Switch value on a regular basis
            if (this.model.value) {
                this.model.value = false;
            } else {
                this.model.value = true;
            }
        }, this.params.frequency);
        console.info('Simulated %s actuator started!', this.pluginName);
    }

};

//#A Observe the model for the LEDs
//#B Listen for model changes, on changes call switchOnOff
//#C Change the LED state by changing the GPIO state
//#D Connect the GPIO in write (output) mode
