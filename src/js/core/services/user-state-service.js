'use strict';

var Cookies = require('js-cookie');

module.exports = function (app) {
    app.service('UserStateService', ['$rootScope', '$timeout', serviceFun])
};

function serviceFun($rootScope, $timeout) {

    var REFRESH_TOKEN = "refresh-token",
        ACCESS_TOKEN = "access-token",
        USER_NAME = "auth-username";

    var loggedInEventListeners = [],
        userWasNotAuthenticated = true;

    function executeQueue() {
        loggedInEventListeners.forEach(function (fn) {
            fn();
        });
    }

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
            executeQueue();
            if (!userWasNotAuthenticated) {
                $rootScope.$broadcast('intake24.admin.LoggedIn');
                userWasNotAuthenticated = false;
            }
        },
        logout: function () {
            Cookies.remove(REFRESH_TOKEN);
            Cookies.remove(ACCESS_TOKEN);
            Cookies.set(USER_NAME, '');
            userWasNotAuthenticated = true;
        },
        getUsername: function () {
            return this.getUserInfo().userName;
        },
        getAuthenticated: function () {
            return Cookies.get(REFRESH_TOKEN) != null && Cookies.get(REFRESH_TOKEN) != '';
        },
        getAccessToken: function () {
            return Cookies.get(ACCESS_TOKEN);
        },
        getRefreshToken: function () {
            return Cookies.get(REFRESH_TOKEN);
        },
        getUserInfo: function () {
            try {
                var tokenPart = this.getAccessToken().split(".")[1],
                    parsedToken = JSON.parse(atob(tokenPart)),
                    credentials = JSON.parse(atob(parsedToken.sub)),
                    providerParts = credentials.providerKey.split("#");

                if (providerParts.length < 2) {
                    providerParts.unshift(null);
                }

                return {
                    roles: parsedToken.i24r,
                    surveyId: providerParts[0],
                    userName: providerParts[1]
                };
            } catch (e) {
                return {};
            }
        },
        onLoggedIn: function (fn) {
            loggedInEventListeners.push(fn);
        },
        offLoggedIn: function (fn) {
            var i = loggedInEventListeners.indexOf(fn);
            loggedInEventListeners.splice(i, 1);
        }
    }
}