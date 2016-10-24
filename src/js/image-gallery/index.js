'use strict';

require("angular");
require("angular-sanitize");
require("angular-animate");
require("angular-touch");
require("angular-ui-bootstrap");
require("angular-cookies");
require("ui-select");
require("angular-route");

var moduleRequirements = ['ngCookies', 'ui.bootstrap', 'ngSanitize', 'ngAnimate', 'ngTouch', 'ui.select', 'ngRoute'],
    app = angular.module('intake24.gallery', moduleRequirements);

require('./controllers')(app);
require('./directives')(app);
require('./services')(app);
require('./filters')(app);
require('../shared/config')(app);
require('./set-routes')(app);

require('./image-load')();

window.api_base_url = process.env.API_BASE_URL;