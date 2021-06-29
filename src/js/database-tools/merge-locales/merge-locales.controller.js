"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.controller("MergeLocalesController", ["$scope", "MergeLocalesService",
        "LocalesService", "MessageService", "appRoutes", controllerFun]);
};

function controllerFun($scope, MergeLocalesService, LocalesService, MessageService, AppRoutes) {


    $scope.requestInProgress = false;
    $scope.baseLocale = undefined;
    $scope.mergeLocale = undefined;
    $scope.targetLocale = undefined;
    $scope.errors = [];

    LocalesService.list().then(function (locales) {
        $scope.locales = locales;
    });

    $scope.uploadSpreadsheet = function (files) {
        $scope.requestInProgress = true;

        MergeLocalesService.mergeLocales($scope.baseLocale, $scope.mergeLocale, $scope.targetLocale, files[0]).then(
            function (response) {
                $scope.requestInProgress = false;
                MessageService.showSuccess("New locale initialised successfully");
            }, function (response) {
                $scope.requestInProgress = false;

                if (response.status == 400) {
                    $scope.errors = response.data.errors;
                }
            }
        );
    };
}
