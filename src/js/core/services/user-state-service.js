'use strict';

module.exports = function (app) {
    app.service('UserStateService', ['$rootScope', '$timeout', '$cookies', serviceFun])
};

function serviceFun($rootScope, $timeout, $cookies) {

    var REFRESH_TOKEN = "refresh-token",
        ACCESS_TOKEN = "access-token",
        USER_NAME = "auth-username",
        OPTIONS = {path: "/"};

    var loggedInEventListeners = [],
        userWasNotAuthenticated = true;

    function executeQueue() {
        loggedInEventListeners.forEach(function (fn) {
            fn();
        });
    }

    return {
        init: function (username, refreshToken) {
            $cookies.put(USER_NAME, username, OPTIONS);
            this.setRefreshToken(refreshToken);
        },
        setRefreshToken: function (refreshToken) {
            $cookies.put(REFRESH_TOKEN, refreshToken, OPTIONS);
        },
        setAccessToken: function (accessToken) {
            $cookies.put(ACCESS_TOKEN, accessToken, OPTIONS);
            executeQueue();
            if (!userWasNotAuthenticated) {
                $rootScope.$broadcast('intake24.admin.LoggedIn');
                userWasNotAuthenticated = false;
            }
        },
        logout: function () {
            // To make it work in IE
            $cookies.put(REFRESH_TOKEN, "expired", { expires: new Date("1970-01-01"), path: "/"});
            $cookies.put(ACCESS_TOKEN, "expired", { expires: new Date("1970-01-01"), path: "/"});
            $cookies.remove(REFRESH_TOKEN);
            $cookies.remove(ACCESS_TOKEN);
            $cookies.put(USER_NAME, '', OPTIONS);
            userWasNotAuthenticated = true;
        },
        getUsername: function () {
            return this.getUserInfo().userName;
        },
        getAuthenticated: function () {
            return $cookies.get(REFRESH_TOKEN) != null && $cookies.get(REFRESH_TOKEN) != '';
        },
        getAccessToken: function () {
            return $cookies.get(ACCESS_TOKEN);
        },
        getRefreshToken: function () {
            return $cookies.get(REFRESH_TOKEN);
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