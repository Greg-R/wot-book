/*jshint esversion: 6 */

var resources = require('./resources.json');
//  module.exports = resources;  (Original code)

//  Need to export the Proxy of resources:

var resourcesProxy = new Proxy(resources, {});

//module.exports = proxyResources;

module.exports = {
    'resourcesObject': resources,
    'resourcesProxy': resourcesProxy
};


//  So this is the simplest of all possible proxies;
//  It simply forwards any updates done on the proxy to the
//  original target object (first parameter of the Proxy constructor).

