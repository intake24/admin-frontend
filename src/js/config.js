'use strict';

module.exports = function (app) {
    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
    });
};