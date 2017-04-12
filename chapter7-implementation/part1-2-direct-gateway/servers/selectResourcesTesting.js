/*jshint esversion: 6 */

var resources = require('./../resources/model').resourcesObject;

var resourcesProxy = require('./../resources/model').resourcesProxy;

function selectResource(url) { //#E
  var parts = url.split('/');
  parts.shift();
  var result = resources;
  for (var i = 0; i < parts.length; i++) {
    result = result[parts[i]];
  }
  return result;
}

let urlTest = '/pi/sensors/temperature';

let temperatureObject = selectResource(urlTest);

console.log(temperatureObject);

//  Now make a Proxy using the object.

let temperatureProxy = new Proxy(selectResource(urlTest), {
    set: function(target, property, value, receiver) {
        target[property] = value;
        console.log('The temperatureProxy set has been called.');
        return true;
    }
});

resources.pi.sensors.temperature.value = 50.0;

// temperatureProxy.value = 60.0;

resourcesProxy.pi.sensors.temperature.value = 70.0;
