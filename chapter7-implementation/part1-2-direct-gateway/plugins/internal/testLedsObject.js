/*jshint esversion: 6 */

//  Test the LedsObject.

let LedController = require('./ledsObject');

let params = {
    'simulate': false,
    'frequency': 1000
};

let ledcontroller = new LedController(params);

ledcontroller.start();

ledcontroller.switchOnOff(true);

//  The flash method is for testing the class.

ledcontroller.flash(2000);

//ledcontroller.modelProxy.value = false;