'use strict';

module.exports = function (app) {
    app.controller('AssociatedFoodController', ['$scope', '$routeParams', 'LocalesService', 'DrawersService',
        controllerFun]);
};

function controllerFun($scope, $routeParams, LocalesService, DrawersService) {

    var selectedItem = null;

    $scope.addAssociatedFood = function () {
        $scope.$parent.itemDefinition.local.associatedFoods.push({
            foodOrCategory: null,
            mainFood: false,
            linkAsMain: false,
            promptText: "",
            genericName: ""
        })
    };

    $scope.removeAssociatedFood = function (item) {
        var i = $scope.$parent.itemDefinition.local.associatedFoods.indexOf(item);
        $scope.$parent.itemDefinition.local.associatedFoods.splice(i, 1);
    };

    $scope.showAssociatedFoodDrawer = function (obj) {
        var callback = function (value) {
            selectedItem.foodOrCategory = value;
            DrawersService.drawerAssociatedFood.offValueSet(callback);
        };
        selectedItem = obj;
        DrawersService.drawerAssociatedFood.open();
        DrawersService.drawerAssociatedFood.onValueSet(callback);
    };

    $scope.getFoodTextDirection = function (food) {
        if (food.localDescription && food.localDescription.defined) {
            return $scope.localeTextDirection;
        }
    };

    LocalesService.getLocale($routeParams.locale).then(function (locale) {
        $scope.localeTextDirection = locale.textDirection;
    });
}
