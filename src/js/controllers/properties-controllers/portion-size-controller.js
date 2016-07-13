'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('PortionSizeController',
        ['$scope', 'FoodDataReader', 'SharedData', controllerFun]);
};

function controllerFun($scope, FoodDataReader, SharedData) {

    $scope.sharedData = SharedData;
    $scope.portionSizesValidations = [];

    $scope.addPortionSize = function () {
        $scope.portionSizes.push({
            method: 'as-served',
            description: '',
            imageUrl: '',
            useForRecipes: false,
            parameters: {}
        });
    };

    $scope.copyEnglishMethods = function () {
        var currentItem = $scope.currentItem,
            promise;
        if ($scope.currentItem.type == 'category') {
            promise = FoodDataReader.getCategoryDefinition(currentItem.code, "en_GB");
        } else {
            promise = FoodDataReader.getFoodDefinition(currentItem.code, "en_GB");
        }
        promise.then(function successCallback(data) {
            currentItem.localData = data.localData;
        });
    };

    $scope.deletePortionSize = function (index) {
        $scope.portionSizes.splice(index, 1);
    };

    $scope.$watchCollection('$parent.itemDefinition.local.portionSize', function () {
        if ($scope.$parent.itemDefinition == null) {
            $scope.portionSizes = null;
            return;
        } else {
            $scope.portionSizes = $scope.$parent.itemDefinition.local.portionSize;
        }
        $scope.portionSizesValidations = _.map($scope.portionSizes, function () {
            return true;
        });
    });

    $scope.$watchCollection('portionSizesValidations', function () {
        $scope.$parent.$parent.portionSizeIsValid = _.reduce($scope.portionSizesValidations, function (a, b) {
                return a && b;
            }) ||
            $scope.$parent.$parent.currentItem.type != 'food' && $scope.portionSizesValidations.length == 0;
    });

}