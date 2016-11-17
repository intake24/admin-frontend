'use strict';

var angular = require('angular'),
    _ = require('underscore'),
    PORTION_DESCRIPTIONS = require('../../constants/portion-description-en')(),
    STANDARD_UNITS = require('../../constants/standard-units-en')(),
    PORTION_IMAGES = require('../../constants/default-portion-size-selection-images')();

var controllerName = 'PortionSizeItemController';

module.exports = function (app) {
    app.controller(controllerName,
        ['$scope', 'DrawersService', 'SharedData', controllerFun]);
};

function controllerFun($scope, DrawersService, SharedData) {

    var selectedItem = null,
        targetField = undefined;

    $scope.portionSizeDescriptions = PORTION_DESCRIPTIONS;
    $scope.standardUnits = STANDARD_UNITS;

    $scope.sharedData = SharedData;

    $scope.imageUrlEditable = false;

    $scope.toggleImageUrlEdit = function() {
        $scope.imageUrlEditable = !$scope.imageUrlEditable;
    };

    $scope.selectServingImageSet = function (resultObj) {
        selectedItem = resultObj;
        targetField = 'serving_image_set';
        DrawersService.drawerAsServedImageSet.setValue(selectedItem.serving_image_set);
        DrawersService.drawerAsServedImageSet.open();
    };

    $scope.selectLeftoversImageSet = function (resultObj) {
        selectedItem = resultObj;
        targetField = 'leftovers_image_set';
        DrawersService.drawerAsServedImageSet.setValue(selectedItem.leftovers_image_set);
        DrawersService.drawerAsServedImageSet.open();
    };

    $scope.showGuideImageDrawer = function (resultObj) {
        selectedItem = resultObj;
        DrawersService.drawerGuideImage.open();
    };

    $scope.showDrinkwareDrawer = function (resultObj, resultField) {
        selectedItem = resultObj;
        DrawersService.drawerDrinkware.open();
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
                    portionSize.cachedParameters[portionSize.method] = angular.copy(portionSize.parameters);

                if (portionSize.cachedParameters[new_method_id])
                    portionSize.parameters = portionSize.cachedParameters[new_method_id];
                else {
                    // Default common fields
                    portionSize.description = "";
                    portionSize.useForRecipes = false;
                    portionSize.imageUrl = "images/placeholder.jpg";

                    var parameters = {};

                    // Method-specific default parameters
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

    $scope.removeStandardUnit = function (index) {
        $scope.portionSize.parameters.units.splice(index, 1);
    };

    $scope.addStandardUnit = function () {
        var newUnit = {name: "", value: "", omitFoodDescription: false};
        $scope.portionSize.parameters.units.push(newUnit);
    };

    $scope.unitHasError = function (unit) {
        return unit.name == '' || unit.value == '';
    };

    $scope.$watch(function () {
        return DrawersService.drawerAsServedImageSet.getValue();
    }, function () {
        if (!selectedItem) {
            return;
        }
        selectedItem[targetField] = DrawersService.drawerAsServedImageSet.getValue();
    });

    $scope.$watch(function () {
        return DrawersService.drawerAsServedImageSet.getOpen();
    }, function () {
        if (!DrawersService.drawerAsServedImageSet.getOpen()) {
            selectedItem = null;
        }
    });

    $scope.$watch(function () {
        return DrawersService.drawerGuideImage.getValue();
    }, function () {
        if (!selectedItem) {
            return;
        }
        selectedItem.guide_image_id = DrawersService.drawerGuideImage.getValue();
    });

    $scope.$watch(function () {
        return DrawersService.drawerGuideImage.getOpen();
    }, function () {
        if (!DrawersService.drawerGuideImage.getOpen()) {
            selectedItem = null;
        }
    });

    $scope.$watch(function () {
        return DrawersService.drawerDrinkware.getValue();
    }, function () {
        if (!selectedItem) {
            return;
        }
        selectedItem.drinkware_id = DrawersService.drawerDrinkware.getValue();
    });

    $scope.$watch(function () {
        return DrawersService.drawerDrinkware.getOpen();
    }, function () {
        if (!DrawersService.drawerDrinkware.getOpen()) {
            selectedItem = null;
        }
    });

    $scope.$watch('portionSize.description', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.portionSize.imageUrl = PORTION_IMAGES[$scope.portionSize.description];
            $scope.imageUrlEditable = false;
        }
    });

}
