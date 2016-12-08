"use strict";

module.exports = function (app) {
    app.service("HttpRequestInterceptor", ["$q", "MessageService", "UserStateService",
        function ($q, MessageService, UserStateService) {
            return {
                request: function (config) {
                    config.headers["X-Auth-Token"] = UserStateService.getAuthCookies();
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
                    if (rejection.status == 200) {

                    } else if (rejection.status == 401) {
                        if (rejection.config.url == api_base_url + "signin") {
                            MessageService.showMessage(gettext("Failed to log you in"), "danger");
                        } else {
                            MessageService.showMessage(gettext("Your session has expired. Please log in."), "danger");
                        }
                        UserStateService.logout();
                    } else {
                        MessageService.showMessage(gettext("Something went wrong. Please check the console for details."), "danger");
                    }
                    return $q.reject(rejection);
                },
                xmlHttpRequestConfig: function (xmlHttpReq) {
                    var self = this;
                    xmlHttpReq.setRequestHeader("X-Auth-Token", UserStateService.getAuthCookies());
                    xmlHttpReq.addEventListener("load", function () {
                        self.responseError(xmlHttpReq);
                    });
                }
            };
        }]);
};