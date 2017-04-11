var resources = require('./../resources/model');

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

console.log(selectResource(urlTest));