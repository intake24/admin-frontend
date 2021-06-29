"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.controller("UpdateUKSAController", ["$scope", "UpdateUKSAService",
        "LocalesService", "MessageService", "appRoutes", controllerFun]);
};

function controllerFun($scope, UpdateUKSAService, LocalesService, MessageService, AppRoutes) {

    $scope.errors = [];
    $scope.requestInProgress = false;

    $scope.update = function () {
        $scope.requestInProgress = true;

        UpdateUKSAService.updateUKSA().then(
            function (response) {
                $scope.requestInProgress = false;
                MessageService.showSuccess("UKSAv2 portion sizes updated successfully");
            }, function (response) {
                $scope.requestInProgress = false;

                if (response.status == 400) {
                    $scope.errors = response.data.errors;
                }
            }
        );
    };
}
