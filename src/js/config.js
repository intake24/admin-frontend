'use strict';

module.exports = function (app) {
    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('HttpRequestInterceptor');
    }]);
};