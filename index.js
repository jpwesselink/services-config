'use strict';

// get an env in here

// find all configs
var argv = require('yargs').argv;
var constantCase = require('constant-case');
var negate = require('lodash.negate');
var isObject = require('lodash.isobject');
var isUndefined = require('lodash.isundefined');
var isFunction = require('lodash.isfunction');
var merge = require('lodash.merge');
var bulk = require('bulk-require');
var resolverRevolver = require('resolver-revolver');
var util = require('util');
var zipObject = require('lodash.zipobject');

module.exports = function (options) {
  // patch our console
  var defaults = {
    console: zipObject(['log', 'info', 'warn', 'error'].map(function (level) {
      return [level, function () {}];
    })),
    prefix: 'SERVICE_ENV_',
    transformResult: transformResult,
    transformCollection: transformCollection,
    default: 'development'
  };

  if (isUndefined(options)) {
    options = {};
  }
  if (!isObject(options)) {
    throw {
      name: 'Error',
      message: 'Expected options to be an object'
    };
  }

  options = merge({}, defaults, options);
  var log = options.console.log;

  // Set up the fetching of all modules in ./services

  // Show the world where we will look for modules
  log(util.format('Looking for services in %s',
    options.targets));

  // Grab those modules
  var services = bulk(options.targets, ['**/*.js']);

  var resolved = validateEnv();
  // And give feedback on which ones we have found.
  log(util.format('Found %s: %s',
    Object.keys(services).length,
    Object.keys(services).join(', ')
  ));

  // suckage, refactor this dude
  var servicesConfig = {
    one: one,
    current: current,
    all: all,
    availableConfigs: availableConfigs
  };

  return servicesConfig;

  // functions

  function transformResult(value, serviceName) {
    return [serviceName, value];
  }

  function transformCollection(tuple) {
    return zipObject(tuple);
  }

  function current() {
    var serviceNames = Array.prototype.slice.call(arguments, 0);
    return options.transformCollection(serviceNames.map(function (serviceName) {
      var targetName = resolved[serviceName]();

      var foundService = one(serviceName);

      return options.transformResult({
          target: targetName,
          service: foundService[targetName]
        },
        serviceName);
    }));
  }

  function one(serviceName) {
    var foundService = services[serviceName];
    if (isFunction(foundService)) {
      foundService = foundService();
    }
    if (isUndefined(foundService)) {
      throw {
        name: 'Error',
        message: util.format(
          'Could not find service %s in %s',
          foundService,
          Object.keys(services)
        )
      };
    }

    return foundService;
  }

  function all() {
    var serviceNames = Array.prototype.slice.call(arguments, 0);
    if (serviceNames.length === 0) {
      serviceNames = Object.keys(services);
    }
    return zipObject(serviceNames.map(function (serviceName) {
      var service = one(serviceName);
      return [serviceName, merge({}, service)];
    }));
  }

  function availableConfigs() {
    return Object.keys(services);
  }

  function validateEnv() {
    var isDefinedCondition = {
      fn: negate(isUndefined),
      name: 'is defined'
    };

    var resolvables = zipObject(
      Object.keys(services)
      .map(function (serviceName) {

        var constantName = constantCase(options.prefix + serviceName);
        var service = services[serviceName];
        if (isFunction(service)) {
          service = service();
        }
        return [serviceName, {
          from: ['argv.' + constantName, 'process.env.' + constantName],
          default: options.default,
          preconditions: [isDefinedCondition, {
            name: 'is service',
            fn: function (value) {
              return Object.keys(service).indexOf(value) !== -1;
            }
          }],
          throwOnNoResolution: true
        }];
      })
    );

    var resolved = resolverRevolver.parse({
      console: options.console,
      context: {
        argv: argv,
        process: {
          env: process.env
        }
      },
      resolvables: resolvables
    });

    return resolved;
  }
};
