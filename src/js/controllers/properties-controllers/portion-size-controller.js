'use strict';

module.exports = function (app) {
    app.controller('PortionSizeController',
        ['$scope', 'FoodDataReader', 'SharedData', 'DrawersService', controllerFun]);
};

function controllerFun($scope, FoodDataReader, SharedData, DrawersService) {

    $scope.sharedData = SharedData;

    $scope.addPortionSize = function () {
        $scope.$parent.itemDefinition.local.portionSize.push({
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
        $scope.$parent.itemDefinition.local.portionSize.splice(index, 1);
    };

}