# Building the Web of Things - An Update to Chapter 7 Code
This repository contains a modified version of the example project in Chapter 7 [Building the Web of Things](http://book.webofthings.io) book.

The goal of this fork is to remove the Object.observe function which is depracated in recent versions of Ecmascript (JavaScript).
The temperature/sensor Javascript module was modified into a class using the ES6 class declaration.
Since it was desired to emit events from the sensor object, the class inherits from Node.js "EventEmitter".

The first attempt at this used the ES6 "Proxy" object.  Although this was made to partially work, using a sensor object with EventEmitter seemed to be more straightforward and natural fit into Node.  There were only a few lines of code changed to implement the sensor object into the project.

The actuator (LED), however, required the Proxy.  This Proxy is a property of the LED actuator object.  The object must be instantiated into the actuator routes module (actuators.js).  This is so that the property is changed by "set" to the Proxy, not to the resources object itself.  The LED actuator object observers the state change, and changes the state of the LED according to the value of the property.  This functions and was verified at the command line using curl exactly as shown in the book.  The Proxy should forward the update (set) to the resources object, although this has not been verified.

The version of Node used was v7.8.0.  The project was run on a RaspberryPi 2 and was connected to my home network with a LAN cable.  The kernel information from the Pi:

Linux raspberrypi 4.4.34-v7+ #930 SMP Wed Nov 23 15:20:41 GMT 2016 armv7l GNU/Linux

Connecting to the Pi was done using Ubuntu Mint 16.03 with the Chromium browser.  The Chromium developer tools were used to observe HTTP and WebSocket activity.

You will need to install the temperature/humidity sensor driver and also run npm update.

To start the server:

sudo node wot-server.js

Also included is a simple HTML page which updates as data is received
from the server via WebSocket.  Note that this page can only view either temperature or humidity data.  Edit the file in order to see the desired data (which is updated continuously via WebSocket).

Here is the original summary included with the project for reference:

# What is the book about?
The book is all about building apps for the Internet of Things using Web technologies. 
In more technical terms it is all about Node.js, JavaScript, HTTP, WebSockets for embedded devices!

![building the web of things](https://raw.githubusercontent.com/webofthings/webofthings.js/master/docs/building-the-web-of-things.png)
 
 [Get Building the Web of Things!](http://book.webofthings.io)
