"use strict";

module.exports = function (app) {
    app.service("HttpRequestInterceptor", ["$q", "$injector", "MessageService", "UserStateService",
        function ($q, $injector, MessageService, UserStateService) {

            function retryRequest(rejection) {
                // ToDo: All failed requests must be replayed once user has logged in
                if (UserStateService.getRefreshToken() == null &&
                    UserStateService.getAccessToken() == null) {
                    return $q.reject(rejection);
                }
                var $timeout = $injector.get('$timeout');
                return $timeout(function () {
                    var $http = $injector.get('$http'),
                        url = window.api_base_url + "refresh";
                    return $http.post(url).then(function (data) {
                        UserStateService.setAcccessToken(data.accessToken);
                        return $http(rejection.config);
                    }, function () {
                        UserStateService.logout();
                    });

                });
            }

            return {
                request: function (config) {

                    if (config.url == window.api_base_url + "refresh") {
                        config.headers["X-Auth-Token"] = UserStateService.getRefreshToken();
                        return config;
                    } else if (config.url == window.api_base_url + "signin") {
                        return config;
                    } else {
                        config.headers["X-Auth-Token"] = UserStateService.getAccessToken();
                        return config;
                    }
                },
                response: function (response) {
                    // We process only api calls to leave calls for templates untouched.
                    if (response.config.url.search(window.api_base_url) > -1) {
                        return response.data;
                    } else {
                        return response;
                    }
                },
                responseError: function (rejection) {
                    if (rejection.status == 200) {

                    } else if (rejection.status == 401) {
                        if (rejection.config.url == window.api_base_url + "signin") {
                            MessageService.showMessage(gettext("Failed to log you in"), "danger");
                        } else {
                            return retryRequest(rejection);
                        }

                    } else {
                        MessageService.showMessage(gettext("Something went wrong. Please check the console for details."), "danger");
                    }
                    return $q.reject(rejection);
                },
                xmlHttpRequestConfig: function (xmlHttpReq) {
                    var self = this;
                    xmlHttpReq.setRequestHeader("X-Auth-Token", UserStateService.getAccessToken());
                    xmlHttpReq.addEventListener("load", function () {
                        self.responseError(xmlHttpReq);
                    });
                }
            };
        }]);
};