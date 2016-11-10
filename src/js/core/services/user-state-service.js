'use strict';

var Cookies = require('js-cookie');

module.exports = function (app) {
    app.service('UserStateService', ['$rootScope', '$timeout', serviceFun])
};

function serviceFun($rootScope, $timeout) {
    return {
        set: function (username, token) {
            Cookies.set('auth-token', token);
            Cookies.set('auth-username', username);
            $rootScope.$broadcast('intake24.admin.LoggedIn');
        },
        logout: function () {
            Cookies.remove('auth-token');
            Cookies.set('auth-username', '');
        },
        getUsername: function () {
            return Cookies.get('auth-username');
        },
        getAuthenticated: function () {
            return Cookies.get('auth-token') != undefined && Cookies.get('auth-token') != '';
        },
        getAuthCookies: function () {
            return Cookies.get('auth-token');
        }
    }
}