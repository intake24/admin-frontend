'use strict';

module.exports = function (app) {
    app.controller('PortionSizeController',
        ['$scope', 'FoodDataReader', 'SharedData', 'Drawers', controllerFun]);
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

    $scope.portionSizeMethodModel = function (portionSize) {
        return function (new_method_id) {
            if (arguments.length == 0) {
                return portionSize.method;
            } else {
                // Remember current parameters so that data isn't lost when user
                // switches portion size methods

                if (!portionSize.cachedParameters)
                    portionSize.cachedParameters = {};

                // Ignore default undefined selection
                if (portionSize.method)
                    portionSize.cachedParameters[portionSize.method] = portionSize.parameters;

                if (portionSize.cachedParameters[new_method_id])
                    portionSize.parameters = portionSize.cachedParameters[new_method_id];
                else {
                    // Use default parameters
                    var parameters = {description: "", useForRecipes: false, imageUrl: "images/placeholder.jpg"}

                    // Add method-specific default parameters if required
                    switch (new_method_id) {
                        case "as-served":
                            parameters.useLeftoverImages = false;
                            break;
                        case "standard-portion":
                            parameters.units = [];
                            break;
                        case "drink-scale":
                            parameters.initial_fill_level = 0.9;
                        case "cereal":
                            parameters.cereal_type = "hoop";
                        default:
                            break;
                    }
                    portionSize.parameters = parameters;
                }
                portionSize.method = new_method_id;
            }
        }
    };

    $scope.deletePortionSize = function (index) {
        $scope.$parent.itemDefinition.local.portionSize.splice(index, 1);
    };

}