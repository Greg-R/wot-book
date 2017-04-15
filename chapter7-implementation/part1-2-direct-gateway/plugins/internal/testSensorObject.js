/*jshint esversion: 6 */

var resources = require('./../../resources/model');
let TempHumSensor = require('./DHT22SensorObject');

let params = {'simulate': false, 'frequency': 1000};

let temphumsensor = new TempHumSensor(params);

console.log(temphumsensor.model.temperature.value);

temphumsensor.on('tempEvent', () => {console.log('tempEvent fired!');});
temphumsensor.on('humidityEvent', () => {console.log('humidityEvent fired!');});

temphumsensor.start();

console.log(temphumsensor.model.temperature.value);

console.log(temphumsensor.model);

