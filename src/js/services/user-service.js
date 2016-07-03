'use strict';

var Cookies = require('js-cookie');

module.exports = function (app) {
    app.service('UserService', ['$http', '$q', '$rootScope', '$timeout', serviceFun])
};

function serviceFun($http, $q, $rootScope, $timeout) {
    var __username = '',
        authenticated = false;

    function init() {
        if (!Cookies.get('auth-token')) {
            return;
        }
        authenticated = true;
        __username = Cookies.get('auth-username');
        $timeout(function () {
            $rootScope.$broadcast('intake24.admin.LoggedIn');
        });
    }

    init();

    return {
        login: function (username, password, survey_id) {
            var defer = $q.defer(),
                url = api_base_url + 'signin',
                data = {survey_id: survey_id || '', username: username, password: password};

            $http.post(url, data).then(function successCallback(response) {
                __username = username;
                authenticated = true;
                Cookies.set('auth-token', response.data.token);
                Cookies.set('auth-username', username);
                $rootScope.$broadcast('intake24.admin.LoggedIn');
                defer.resolve();

            }, function errorCallback(response) {
                if (response.status === 401) {
                    authenticated = false;
                    Cookies.remove('auth-token');
                }
                defer.reject();
            });

            return defer.promise;
        },
        logout: function () {
            Cookies.remove('auth-token');
            authenticated = false;
            __username = '';
        },
        getUsername: function () {
            return __username;
        },
        getAuthenticated: function () {
            return authenticated;
        }
    }
}