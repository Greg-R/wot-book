/*jshint esversion: 6 */

//  This version of websockets.js uses Sensor objects which inherit EventEmitter
//  rather than use the depracated "Object.observe()" function.

var WebSocketServer = require('ws').Server;

let resources = require('./../resources/model'); //#A

let TempHumSensor = require('../plugins/internal/DHT22SensorObject');
let PIRsensor = require('../plugins/internal/pirObject');
let ledsActuator = require('../plugins/internal/ledsObject');
let params = {
    'simulate': false,
    'frequency': 1000
};
let temphumsensor = new TempHumSensor(params); // Instantiate the TempHumSensor object.
temphumsensor.start(); // Start collecting data.
let pirsensor = new PIRsensor(params); // Instantiate the PIRsensor object.
pirsensor.start(); // Start collecting data.
let ledsactuator = new ledsActuator(params); // Instantiate the PIRsensor object.
ledsactuator.start(); // Begin listening for commands.

exports.listen = function (server) {
    var wss = new WebSocketServer({
        server: server
    }); //#B
    console.info('WebSocket server started...');
    wss.on('connection', function (ws) { //#C
        var url = ws.upgradeReq.url;
        console.info(url);
        let resourceObject = selectResource(url);
        console.log(`The sensor object event name is ${resourceObject.eventName}.`);
        temphumsensor.on(resourceObject.eventName, function () { //#D subscribe to event.
            ws.send(JSON.stringify(resourceObject), function () {
                console.log('ws.send function called by temphumsensor!');
                console.log(resourceObject);
            });
        });
        pirsensor.on(resourceObject.eventName, function () { //#D subscribe to event.
            ws.send(JSON.stringify(resourceObject), function () {
                console.log('ws.send function called by pirsensor!');
                console.log(resourceObject);
            });
        });
    });
};

//  The following function is critical in that it returns a single "flat" object.
//  For example, selectResource('/pi/sensors/temperature') returns this object:
//{
//    name: 'Temperature Sensor',
//    description: 'An ambient temperature sensor.',
//    unit: 'celsius',
//    value: 0,
//    gpio: 12,
//    event: "tempEvent"   <-- NOTE!  This is a new property.
//}

function selectResource(url) { //#E
    var parts = url.split('/');
    parts.shift();
    var result = new Proxy(resources, {});
    for (var i = 0; i < parts.length; i++) {
        result = result[parts[i]];
    }
    console.log(`The object.name returned by selectResource is ${result.name}`);
    return result;
}

//#A Require, instantiate, and start the temperature/humidity sensor.
//#B Create a WebSockets server by passing it the Express server
//#C Triggered after a protocol upgrade when the client connected
//#D Subscribe to the event corresponding to the resource in the protocol upgrade URL
//#E This function takes a request URL and returns the corresponding resource
