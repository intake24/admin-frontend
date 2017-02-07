'use strict';

var Cookies = require('js-cookie');

module.exports = function (app) {
    app.service('UserStateService', ['$rootScope', '$timeout', serviceFun])
};

function serviceFun($rootScope, $timeout) {

    var REFRESH_TOKEN = "refresh-token",
        ACCESS_TOKEN = "access-token",
        USER_NAME = "auth-username";

    return {
        init: function (username, refreshToken) {
            Cookies.set(USER_NAME, username);
            this.setRefreshToken(refreshToken);
        },
        setRefreshToken: function (refreshToken) {
            Cookies.set(REFRESH_TOKEN, refreshToken);
        },
        setAcccessToken: function (accessToken) {
            Cookies.set(ACCESS_TOKEN, accessToken);
            $rootScope.$broadcast('intake24.admin.LoggedIn');
        },
        logout: function () {
            Cookies.remove(REFRESH_TOKEN);
            Cookies.remove(ACCESS_TOKEN);
            Cookies.set(USER_NAME, '');
        },
        getUsername: function () {
            return Cookies.get(USER_NAME);
        },
        getAuthenticated: function () {
            return Cookies.get(REFRESH_TOKEN) != undefined && Cookies.get(REFRESH_TOKEN) != '';
        },
        getAccessToken: function () {
            return Cookies.get(ACCESS_TOKEN);
        },
        getRefreshToken: function () {
            return Cookies.get(REFRESH_TOKEN);
        }
    }
}