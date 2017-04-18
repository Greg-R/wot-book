/*jshint esversion: 6 */

//  Updated to use Proxy.

var express = require('express'),
    router = express.Router(),
    resources = require('./../resources/model');

//  Instantiate the Actuator object here:

let LedController = require('../plugins/internal/ledsObject.js');
let params = {
    'simulate': false,
    'frequency': 1000
};
let ledObject = new LedController(params);
ledObject.start();

router.route('/').get(function (req, res, next) {
    req.result = resources.pi.actuators;
    next();
});

router.route('/leds').get(function (req, res, next) {
    req.result = resources.pi.actuators.leds;
    next();
});

router.route('/leds/:id').get(function (req, res, next) { //#A
    req.result = resources.pi.actuators.leds[req.params.id];
    next();
}).put(function (req, res, next) { //#B

    let selectedLedProxy = ledObject.modelProxy;

    // Write to the Proxy provided by the Actuator 
    var selectedLed = resources.pi.actuators.leds[req.params.id];
    selectedLedProxy.value = req.body.value; //#C
    req.result = selectedLed;
    next();
});

module.exports = router;

//#A Callback for a GET request on an LED
//#B Callback for a PUT request on an LED
//#C Update the value of the selected LED in the model
