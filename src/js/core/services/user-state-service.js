'use strict';

var _ = require("underscore");

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

    function parseAccessToken(accessToken) {
        var tokenPart = accessToken.split(".")[1],
            parsedToken = JSON.parse(atob(tokenPart)),
            credentials = JSON.parse(atob(parsedToken.sub));

        return {
            userId: parsedToken.userId,
            roles: parsedToken.roles,
            userName: credentials.providerKey,


            isSuperUser: function () {
                return _.contains(this.roles, "superuser");
            },
            isGlobalFoodsAdmin: function () {
                return _.contains(this.roles, "foodsadmin");
            },
            isImagesAdmin: function() {
                return _.contains(this.roles, "imagesadmin");
            },
            isGlobalSurveyAdmin: function () {
                return _.contains(this.roles, "surveyadmin");
            },
            isStaff: function () {
                return _.some(this.roles, function (r) {
                    return r.endsWith("/staff");
                });
            },
            isSurveyStaff: function (surveyId) {
                return _.contains(this.roles, surveyId + "/staff");
            },
            isFoodDatabaseMaintainer: function (localeId) {
                return _.contains(this.roles, "fdbm/" + localeId);
            },

            canAccessFoodDatabase: function () {
                if (window.hideFoodDatabase)
                    return false;

                return this.isSuperUser() || this.isGlobalFoodsAdmin() || _.some(this.roles, function (r) {
                        return r.startsWith("fdbm/");
                    })
            },

            canAccessDatabaseTools: function () {
                if (window.hideFoodDatabase)
                    return false;

                return this.isSuperUser() || this.isGlobalFoodsAdmin();
            },

            canReadFoodDatabase: function (localeId) {
                return this.isSuperUser() || this.isGlobalFoodsAdmin() || this.isFoodDatabaseMaintainer(localeId);
            },

            /* All categories are currently global, so only global admins can create them */
            canCreateCategories: function() {
                return this.isSuperUser() || this.isGlobalFoodsAdmin();
            },

            /* If the user can create global foods, then 'Use exclusively in this locale' flag is unrestricted,
             otherwise it should be locked to the selected locale */
            canCreateGlobalFoods: function () {
                return this.isSuperUser() || this.isGlobalFoodsAdmin();
            },

            canCreateFoods: function (localeId) {
                return this.isSuperUser() || this.isGlobalFoodsAdmin() || this.isFoodDatabaseMaintainer(localeId);
            },

            canUpdateFoodMain: function(restrictions) {
                var outer = this;
                return this.isSuperUser() || this.isGlobalFoodsAdmin() || ( restrictions && restrictions.length > 0 && _.all(restrictions, function(l) { return outer.isFoodDatabaseMaintainer(l); }));
            },

            canUpdateFoodLocal: function(localeId) {
                return this.isSuperUser() || this.isGlobalFoodsAdmin() || this.isFoodDatabaseMaintainer(localeId);
            },

            canDeleteFood: function(restrictions) {
                var outer = this;
                return this.isSuperUser() || this.isGlobalFoodsAdmin() || ( restrictions && restrictions.length > 0 && _.all(restrictions, function(l) { return outer.isFoodDatabaseMaintainer(l); }));
            },

            canUpdateCategoryMain: function() {
                return this.isSuperUser() || this.isGlobalFoodsAdmin();
            },

            canUpdateCategoryLocal: function(localeId) {
                return this.isSuperUser() || this.isGlobalFoodsAdmin() || this.isFoodDatabaseMaintainer(localeId);
            },

            canDeleteCategories: function() {
                return this.isSuperUser() || this.isGlobalFoodsAdmin();
            },

            canAccessSurvey: function (surveyId) {
                return this.isSuperUser() || this.isGlobalSurveyAdmin() || this.isSurveyStaff(surveyId);
            },
            canAccessSurveyManager: function () {
                return this.isSuperUser() || this.isGlobalSurveyAdmin() || this.isStaff();
            },

            canCreateSurveys: function () {
                return this.isSuperUser() || this.isGlobalSurveyAdmin();
            },

            canAccessPortionSizeImages: function () {
                if (window.hideFoodDatabase)
                    return false;

                return this.isSuperUser() || this.isGlobalFoodsAdmin() || this.isImagesAdmin();
            },

            canAccessSurveyFeedback: function () {
                return this.isSuperUser() || this.isGlobalFoodsAdmin();
            },

            canAccessUserManager: function () {
                return this.isSuperUser() || this.isGlobalSurveyAdmin();
            },

            /* This needs to display a server-side 403 Forbidden instead? To avoid showing empty admin page if someone with a non-staff/admin account
             signs in (i.e. a respondent). */
            canAccessApp: function () {
                return this.canAccessFoodDatabase() || this.canAccessSurveyManager() ||
                    this.canAccessPortionSizeImages() || this.canAccessSurveyFeedback() || this.canAccessUserList();
            }
        };
    }

    function executeQueue() {
        loggedInEventListeners.forEach(function (fn) {
            fn();
        });
    }

    var currentUser;

    if ($cookies.get(ACCESS_TOKEN))
        currentUser = parseAccessToken($cookies.get(ACCESS_TOKEN));
    else
        currentUser = null;

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
            currentUser = parseAccessToken(accessToken);
            executeQueue();
            if (!userWasNotAuthenticated) {
                $rootScope.$broadcast('intake24.admin.LoggedIn');
                userWasNotAuthenticated = false;
            }
        },
        logout: function () {
            // To make it work in IE
            $cookies.put(REFRESH_TOKEN, "expired", {expires: new Date("1970-01-01"), path: "/"});
            $cookies.put(ACCESS_TOKEN, "expired", {expires: new Date("1970-01-01"), path: "/"});
            $cookies.remove(REFRESH_TOKEN);
            $cookies.remove(ACCESS_TOKEN);
            $cookies.put(USER_NAME, '', OPTIONS);

            if (currentUser != null) {
                window.location.href = "/";
                currentUser = null;
                userWasNotAuthenticated = true;
            }
        },
        getUsername: function () {
            if (currentUser == null)
                return null;
            else
                return currentUser.userName;
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
            return currentUser;
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