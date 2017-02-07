"use strict";

module.exports = function (app) {
    app.service("HttpRequestInterceptor", ["$q", "MessageService", "UserStateService",
        function ($q, MessageService, UserStateService) {
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
                            // Fixme: Replay request failed on expired access token
                            var url = window.api_base_url + "refresh";
                            var xhr = new XMLHttpRequest();
                            xhr.open("POST", url, true);
                            xhr.setRequestHeader("Content-type", "application/json");
                            xhr.setRequestHeader("X-Auth-Token", UserStateService.getRefreshToken());

                            xhr.onreadystatechange = function () {//Call a function when the state changes.
                                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                                    var data = JSON.parse(xhr.response);
                                    UserStateService.setAcccessToken(data.accessToken);
                                    UserStateService.setRefreshToken(data.refreshToken)
                                } else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 401) {
                                    UserStateService.logout();
                                    MessageService.showMessage(gettext("Your session has expired. Please log in."), "danger");
                                }
                            };
                            xhr.send();
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