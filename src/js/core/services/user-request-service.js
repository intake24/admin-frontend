/**
 * Created by Tim Osadchiy on 27/09/2016.
 */

"use strict";

module.exports = function (app) {
    app.service("UserRequestService", ["$http", "$q", serviceFun])
};

function serviceFun($http, $q) {

    var signInUrl = window.api_base_url + "signin",
        refreshUrl = window.api_base_url + "refresh",
        usersUrl = window.api_base_url + "users";

    return {
        login: function (username, password) {
            var defer = $q.defer(),
                data = {
                    email: username,
                    password: password
                };

            $http.post(signInUrl, data).then(function successCallback(data) {
                defer.resolve(data);
            });

            return defer.promise;
        },
        refresh: function () {
            return $http.post(refreshUrl);
        },
        find: function (query) {
            return $http.get(usersUrl + "?q=" + query + "&limit=20");
        }
    }
}
