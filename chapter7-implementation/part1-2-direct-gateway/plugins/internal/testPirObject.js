/*jshint esversion: 6 */

//  Test the pirObject.

//  Is require of resources necessary?  Shouldn't it be in the object?
var resources = require('./../../resources/model');
let PIRsensor = require('./pirObject');

let params = {
    'simulate': false,
    'frequency': 1000
};

let pirsensor = new PIRsensor(params);

pirsensor.start();

console.log(pirsensor.model.value);

pirsensor.on('pirEvent', () => {
    console.log('pirEvent fired!');
});

pirsensor.start();

console.log(pirsensor.model.value);

console.log(pirsensor.model);
