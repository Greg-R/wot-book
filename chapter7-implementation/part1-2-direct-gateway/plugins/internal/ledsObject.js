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
        this.modelProxy = new Proxy(this.model, this.ledHandler());
    }

    start(params) {
        //  observe(model); //#A
        if (this.params.simulate) {
            this.simulate();
        } else {
            this.connectHardware();
        }
    }

    stop() {
        if (this.params.simulate) {
            //        clearInterval(interval);
        } else {
            this.actuator.unexport();
        }
        console.info('%s plugin stopped!', this.pluginName);
    }

    /*function observe(what) {
        Object.observe(what, function (changes) {
            console.info('Change detected by plugin for %s...', pluginName);
            switchOnOff(model.value); //#B
        });
    }*/

    //  Replace the above function observe with a new function based on the Proxy class.

    ledHandler() {
        return {
            set: (receivingObject, property, value) => {
                console.log(`The LED's Proxy is changed and the new value is ${value}`);
                receivingObject[property] = value; //  This performs the change.
                this.switchOnOff(value);  //  Switch the LED.
                return true;
            }
        };
    }

    switchOnOff(value) {
        if (!this.params.simulate) {
            this.actuator.write(value === true ? 1 : 0, () => { //#C
                console.info('Changed value of %s to %s', this.pluginName, value);
            });
        }
    }

    connectHardware() {
        var Gpio = require('onoff').Gpio;
        this.actuator = new Gpio(this.model.gpio, 'out'); //#D
        console.info('Hardware %s actuator started!', this.pluginName);
    }

    flash(duration) {
        let led1 = false;
        setInterval(() => {
            led1 = !led1;
            this.modelProxy.value = led1;
        }, duration);
    }

    simulate() {
        this.interval = setInterval(function () {
            // Switch value on a regular basis
            if (this.modelProxy.value) {
                this.modelProxy.value = false;
            } else {
                this.modelProxy.value = true;
            }
        }, this.params.frequency);
        console.info('Simulated %s actuator started!', this.pluginName);
    }

};

//#A Observe the model for the LEDs
//#B Listen for model changes, on changes call switchOnOff
//#C Change the LED state by changing the GPIO state.  "Arrow function" here allows this to be in scope of object.
//#D Connect the GPIO in write (output) mode
