'use strict';

require("angular");
require("angular-sanitize");
require("angular-animate");
require("angular-touch");
require("angular-ui-bootstrap");
require("angular-cookies");

var config = require('./config'),
    moduleRequirements = ['ngCookies', 'ui.bootstrap', 'ngSanitize', 'ngAnimate', 'ngTouch'],
    app = angular.module('intake24.admin', moduleRequirements);

require('./controllers')(app);
require('./directives')(app);
require('./services')(app);
require('./filters')(app);

window.api_base_url = config.api_base_url;

// Fixme: fix and remove all the scripts from other
require('./other')();