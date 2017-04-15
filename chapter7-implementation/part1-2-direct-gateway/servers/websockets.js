/*jshint esversion: 6 */

var WebSocketServer = require('ws').Server;

let resources = require('./../resources/model');
let TempHumSensor = require('../plugins/internal/DHT22SensorObject');
let params = {'simulate': false, 'frequency': 1000};
let temphumsensor = new TempHumSensor();
temphumsensor.start(params);

exports.listen = function (server) {
    var wss = new WebSocketServer({
        server: server
    }); //#A
    console.info('WebSocket server started...');
    wss.on('connection', function (ws) { //#B
        var url = ws.upgradeReq.url;
        console.info(url);
        let resourceObject = selectResource(url);
        console.log(`The sensor object event name is ${resourceObject.eventName}.`);
        temphumsensor.on(resourceObject.eventName, function() {
            ws.send(JSON.stringify(resourceObject), function() {
                console.log('ws.send function called!');
                console.log(resourceObject);
            });
        }); 
 //           console.log('Unable to observe %s resource!', url);
//        }
    });
};

//  The following function is critical in that it returns a single "flat" object.
//  The Proxy object is designed to work on this sort of flat object.
//  The "resources" object used in this project is nested and does not have
//  a straightforward application to Proxy (recursion is possible);
//  For example, selectResource('/pi/sensors/temperature') returns this object:
//{
//    name: 'Temperature Sensor',
//    description: 'An ambient temperature sensor.',
//    unit: 'celsius',
//    value: 0,
//    gpio: 12
//}

function selectResource(url) { //#E
    var parts = url.split('/');
    parts.shift();
    var result = resources;
    for (var i = 0; i < parts.length; i++) {
        result = result[parts[i]];
    }
    console.log(`The object.name returned by selectResource is ${result.name}`);
    return result;
}


//#A Create a WebSockets server by passing it the Express server
//#B Triggered after a protocol upgrade when the client connected
//#C Register an observer corresponding to the resource in the protocol upgrade URL
//#D Use a try/catch to catch to intercept errors (e.g., malformed/unsupported URLs)
//#E This function takes a request URL and returns the corresponding resource
