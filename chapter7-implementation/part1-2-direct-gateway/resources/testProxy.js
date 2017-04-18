/*jshint esversion: 6 */
//  Test using Proxy with resources.

var resources = require('./model');

//  Create a simple forwarding Proxy:

let resourcesProxy = new Proxy(resources, {
    set: function(target, property, value) {
        console.log('Intercepted value change');
    },
    get: function(target, property) {
        console.log('Intercepted get attempt');
    }
});

//resourcesProxy.pi.actuators.leds[1].value = true;

let test1 = resourcesProxy.pi.actuators.leds[1].value;