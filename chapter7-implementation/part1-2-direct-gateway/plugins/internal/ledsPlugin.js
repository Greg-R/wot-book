/*jshint esversion: 6 */

//  Remember that this is not the Proxy!
//  Changes to the resources object will not be captured.
var resources = require('./../../resources/model').resources;

var actuator, interval;
var model = resources.pi.actuators.leds['1'];
var pluginName = model.name;
var localParams = {
    'simulate': false,
    'frequency': 2000
};

exports.start = function (params) {
    localParams = params;
//    observe(model); //#A  OLD METHOD
    
    let ledProxy = new Proxy(model, {
    set: function (target, property, value, receiver) {
        console.info('Change detected by plugin for %s...', pluginName);
        switchOnOff(model.value);
        target[property] = value;
        return true;
    }
});

    if (localParams.simulate) {
        simulate();
    } else {
        connectHardware();
    }
};

exports.stop = function () {
    if (localParams.simulate) {
        clearInterval(interval);
    } else {
        actuator.unexport();
    }
    console.info('%s plugin stopped!', pluginName);
};
//  This is the original model using Object.observe.
//  Since this is passed a simple object 'model', it should
//  be trivial to substitute a Proxy!
//  Should ledProxy be wrapped by function observe,
//  or should ledProxy simply be placed in exports.start function?



/*function observe(what) {
    Object.observe(what, function (changes) {
        console.info('Change detected by plugin for %s...', pluginName);
        switchOnOff(model.value); //#B
    });
}*/

function switchOnOff(value) {
    if (!localParams.simulate) {
        actuator.write(value === true ? 1 : 0, function () { //#C
            console.info('Changed value of %s to %s', pluginName, value);
        });
    }
}

function connectHardware() {
    var Gpio = require('onoff').Gpio;
    actuator = new Gpio(model.gpio, 'out'); //#D
    console.info('Hardware %s actuator started!', pluginName);
}

function simulate() {
    interval = setInterval(function () {
        // Switch value on a regular basis
        if (model.value) {
            model.value = false;
        } else {
            model.value = true;
        }
    }, localParams.frequency);
    console.info('Simulated %s actuator started!', pluginName);
}

//#A Observe the model for the LEDs
//#B Listen for model changes, on changes call switchOnOff
//#C Change the LED state by changing the GPIO state
//#D Connect the GPIO in write (output) mode
