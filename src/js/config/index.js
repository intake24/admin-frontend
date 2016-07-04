'use strict';

var config;
if (process.env.ENVIRONMENT === "production") {
    config = require('./production');
} else {
    config = require('./development');
}

module.exports = config;