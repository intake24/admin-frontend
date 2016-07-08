'use strict';

require("angular");
require("angular-sanitize");
require("angular-animate");
require("angular-touch");
require("angular-ui-bootstrap");
require("angular-cookies");

var moduleRequirements = ['ngCookies', 'ui.bootstrap', 'ngSanitize', 'ngAnimate', 'ngTouch'],
    app = angular.module('intake24.admin', moduleRequirements);

require('./controllers')(app);
require('./directives')(app);
require('./services')(app);
require('./filters')(app);
require('./config')(app);

window.api_base_url = process.env.API_BASE_URL;

// Fixme: fix and remove all the scripts from other
require('./other')();