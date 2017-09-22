"use strict";

module.exports = function (app) {
    app.service("PasswordResetService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    var resetRequestUrl = $window.api_base_url + "users/password-reset-request";
    var resetPasswordUrl = $window.api_base_url + "users/reset-password";

    return {
        requestPasswordReset: function (email, recaptchaResponse) {
            var req = {
                email: email,
                recaptchaResponse: recaptchaResponse
            };

            return $http.post(resetRequestUrl, req);
        },

        resetPassword: function (token, newPassword) {
            var req = {
                token: token,
                newPassword: newPassword
            };

            return $http.post(resetPasswordUrl, req);
        }

    };
}
