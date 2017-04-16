/*jshint esversion: 6 */

//  Test the pirObject.

let PIRsensor = require('./pirObject');

let params = {
    'simulate': false,
    'frequency': 1000
};

let pirsensor = new PIRsensor(params);

pirsensor.start();

console.log(pirsensor.model.temperature.value);

pirsensor.on('pirEvent', () => {
    console.log('pirEvent fired!');
});

pirsensor.start();

console.log(pirsensor.model.pir.value);

console.log(pirsensor.model);
