"use strict";

module.exports = function (app) {
    app.controller("NutrientMappingExportController", ["$scope", "NutrientMappingExportService",
        "LocalesService", controllerFun]);
};

function controllerFun($scope, NutrientMappingExportService, LocalesService) {

    $scope.locales = [];

    LocalesService.list().then(function (locales) {
        $scope.locales = locales;
    });

    $scope.exportNutrientMapping = function () {
        NutrientMappingExportService.exportMapping($scope.selectedLocale.id);
    }

}
