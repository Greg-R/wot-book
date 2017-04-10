# Building the Web of Things - Code
This repository contains a modified version of the example project in Chapter 7 [Building the Web of Things](http://book.webofthings.io) book.

The goal of this fork is to remove the Object.observe function which is depracated in recent versions of Ecmascript (JavaScript).
The Ecmascript "Proxy" class is used to create equivalent functionality.

Also included is a simple HTML page which updates as data is received
from the server via WebSocket.

Here is the original summary included with the project for reference:

# What is the book about?
The book is all about building apps for the Internet of Things using Web technologies. 
In more technical terms it is all about Node.js, JavaScript, HTTP, WebSockets for embedded devices!

![building the web of things](https://raw.githubusercontent.com/webofthings/webofthings.js/master/docs/building-the-web-of-things.png)
 
 [Get Building the Web of Things!](http://book.webofthings.io)
