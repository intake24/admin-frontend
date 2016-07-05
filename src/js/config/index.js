'use strict';

var config;
if (process.env.ENVIRONMENT === "production") {
    config = require('./production');
} else if (process.env.ENVIRONMENT === "test") {
    config = require('./test');
} else if (process.env.ENVIRONMENT === "development") {
    config = require('./development');
}

module.exports = config;
