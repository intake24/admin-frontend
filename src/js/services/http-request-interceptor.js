'use strict';

var Cookies = require('js-cookie');

module.exports = function (app) {
    app.service('HttpRequestInterceptor', ['$q', 'MessageService', function ($q, MessageService) {
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
            },
            responseError: function (rejection) {
                console.log(rejection);
                if (rejection.status == 401) {
                    if (rejection.config.url == api_base_url + 'signin') {
                        MessageService.showMessage(gettext('Failed to log you in'), 'danger');
                    } else {
                        MessageService.showMessage(gettext('You are not authorized'), 'danger');
                    }
                    Cookies.remove('auth-token');
                } else {
                    MessageService.showMessage(gettext('Something went wrong. Please check the console for details.'), 'danger');
                }
                return $q.reject(rejection);
            }
        };
    }]);
};