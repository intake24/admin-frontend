'use strict';

var Cookies = require('js-cookie');

module.exports = function (app) {
    app.service('httpRequestInterceptor', [function () {
        return {
            request: function (config) {
                config.headers['X-Auth-Token'] = Cookies.get('auth-token');
                return config;
            },
            response: function (response) {
                // We process only api calls to leave calls for templates untouched.
                if (response.config.url.search(api_base_url) > -1) {
                    return response.data;
                } else {
                    return response;
                }
            }
        };
    }]);
};