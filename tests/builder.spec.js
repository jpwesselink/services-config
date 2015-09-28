'use strict';

var platformConfig = require('../index');
var expect = require('expect.js');

describe('platformConfig', function () {
  it('should be a function', function () {
    expect(platformConfig)
      .to.be.a('function');
  });
});
