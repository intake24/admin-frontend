"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.controller("CopyCategoryPsmController", ["$scope", "DeriveLocaleService",
        "LocalesService", "MessageService", "appRoutes", controllerFun]);
};

function controllerFun($scope, DeriveLocaleService, LocalesService, MessageService, AppRoutes) {

    $scope.requestInProgress = false;
    $scope.sourceLocale = undefined;
    $scope.targetLocale = undefined;
    $scope.errors = [];

    LocalesService.list().then(function (locales) {
        $scope.locales = locales;
    });

    $scope.cloneLocal = function () {
        $scope.requestInProgress = true;

        DeriveLocaleService.copyCategoryPortionSizeMethods($scope.sourceLocale, $scope.targetLocale).then(
            function (response) {
                $scope.requestInProgress = false;
                MessageService.showSuccess("Portion size methods copied");
            }, function (response) {
                $scope.requestInProgress = false;

                if (response.status == 400) {
                    $scope.errors = response.data.errors;
                }
            }
        );
    };
}
