'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('PortionSizeController',
        ['$scope', 'SharedData', controllerFun]);
};

function controllerFun($scope, SharedData) {

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