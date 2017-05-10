'use strict';

module.exports = function (app) {
    app.controller('CategoriesController', ['$scope', '$routeParams', 'DrawersService', 'LocalesService',
        controllerFun]);
};

function controllerFun($scope, $routeParams, DrawersService, LocalesService) {

    var localeTextDirection;

    $scope.showParentCategoriesDrawer = function () {
        DrawersService.drawerManageCategories.open();
    };

    $scope.getCategoryTextDirection = function (category) {
        if (category.localDescription && category.localDescription.defined) {
            return localeTextDirection;
        }
    };

    LocalesService.getLocale($routeParams.locale).then(function (locale) {
        localeTextDirection = locale.textDirection;
    });

}