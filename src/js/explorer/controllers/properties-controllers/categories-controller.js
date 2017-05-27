'use strict';

module.exports = function (app) {
    app.controller('CategoriesController', ['$scope', '$routeParams', 'DrawersService', 'LocalesService',
        'ExplorerToProperties', controllerFun]);
};

function controllerFun($scope, $routeParams, DrawersService, LocalesService, ExplorerToProperties) {

    var localeTextDirection;

    $scope.getParentCategories = function () {
        if ($scope.$parent.itemDefinition == null) {
            return [];
        }
        return $scope.$parent.itemDefinition.main.parentCategories.slice().sort(function (a, b) {
            if (a.type + $scope.getNodeDisplayName(a) > b.type + $scope.getNodeDisplayName(b)) {
                return 1;
            } else if (a.type + $scope.getNodeDisplayName(a) < b.type + $scope.getNodeDisplayName(b)) {
                return -1;
            } else {
                return 0;
            }
        });
    };

    $scope.showParentCategoriesDrawer = function () {
        DrawersService.drawerManageCategories.open();
    };

    $scope.getNodeDisplayName = function (node) {
        if (!ExplorerToProperties.getShowLocalDescription()) {
            return node.englishDescription;
        } else {
            return node.localDescription && node.localDescription.defined ?
                node.localDescription.value : node.englishDescription;
        }
    };

    $scope.getCategoryTextDirection = function (category) {
        if (ExplorerToProperties.getShowLocalDescription() &&
            category.localDescription && category.localDescription.defined) {
            return localeTextDirection;
        }
    };

    LocalesService.getLocale($routeParams.locale).then(function (locale) {
        localeTextDirection = locale.textDirection;
    });

}