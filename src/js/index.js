'use strict';

require("angular");
require("angular-sanitize");
require("angular-animate");
require("angular-touch");
require("angular-ui-bootstrap");

var moduleRequirements = ['ngCookies', 'ui.bootstrap', 'ngSanitize', 'ngAnimate', 'ngTouch'],
    app = angular.module('intake24.admin', moduleRequirements);

require('./controllers')(app);
require('./directives')(app);
require('./services')(app);