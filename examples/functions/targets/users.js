'use strict';

module.exports = function () {
  return {
    production: {
      host: 'users.company.com'
    },
    staging: {
      host: 'users.staging.company.com'
    },
    development: {
      host: 'users.local'
    }
  };
};
