'use strict';

module.exports = function (app) {
    app.controller('PasswordResetController', ["$scope", "$location", "$window", "PasswordResetService", "MessageService",
        controllerFun]);
};

function controllerFun($scope, $location, $window, PasswordResetService, MessageService) {

    $scope.password = "";
    $scope.passwordConfirmation = "";

    $scope.resetPassword = function () {

        if ($scope.password != $scope.passwordConfirmation)
            MessageService.showDanger("Password confirmation does not match");
        else if ($scope.password == "")
            MessageService.showDanger("Password cannot be empty");
        else if ($scope.password.length < 8)
            MessageService.showDanger("Password must be at least 8 characters long");
        else {
            var token = $location.search()["token"];

            $scope.buttonDisabled = true;

            PasswordResetService.resetPassword(token, $scope.password).then(
                function () {
                    $scope.resetSuccessful = true;
                    $window.setTimeout(function () {
                        $window.location.href = "/";
                    }, 5000);
                },
                function () {
                    $scope.buttonDisabled = false;
                }
            )
        }
    }
}