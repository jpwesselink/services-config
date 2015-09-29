'use strict';

module.exports = function () {
  return {
    production: {
      host: 'payment.company.com'
    },
    staging: {
      host: 'payment.staging.company.com'
    },
    development: {
      host: 'payment.local'
    }
  };
};
