'use strict';

var path = require('path');
var servicesConfig = require('services-config');
var services = servicesConfig({
  targets: path.join(__dirname, 'targets')
});
var current = services.current('users', 'payment');
console.log(current);
