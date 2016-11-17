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

    $scope.toggleImageUrlEdit = function () {
        $scope.imageUrlEditable = !$scope.imageUrlEditable;
    };

    $scope.selectServingImageSet = function (resultObj) {
        var drawer = DrawersService.drawerAsServedImageSet;
        selectedItem = resultObj;
        targetField = 'serving_image_set';
        drawer.setValue(selectedItem.leftovers_image_set);
        setValueFromDrawer(drawer);
    };

    $scope.selectLeftoversImageSet = function (resultObj) {
        var drawer = DrawersService.drawerAsServedImageSet;
        selectedItem = resultObj;
        targetField = 'leftovers_image_set';
        drawer.setValue(selectedItem.leftovers_image_set);
        setValueFromDrawer(drawer);
    };

    $scope.showGuideImageDrawer = function (resultObj) {
        var drawer = DrawersService.drawerGuideImage;
        selectedItem = resultObj;
        targetField = "guide_image_id";
        setValueFromDrawer(drawer);
    };

    $scope.showDrinkwareDrawer = function (resultObj, resultField) {
        var drawer = DrawersService.drawerDrinkware;
        selectedItem = resultObj;
        targetField = "drinkware_id";
        setValueFromDrawer(drawer);
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
                            break;
                        case "cereal":
                            parameters.cereal_type = "hoop";
                            break;
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

    $scope.$watch('portionSize.description', function (newVal, oldVal) {
        if (newVal != oldVal) {
            setDescriptionImage();
        }
    });

    function setDescriptionImage() {
        $scope.portionSize.imageUrl = PORTION_IMAGES[$scope.portionSize.description];
        $scope.imageUrlEditable = false;
    }

    function setValueFromDrawer(drawer) {
        var callback = function (value) {
            selectedItem[targetField] = value;
            selectedItem = null;
            drawer.offValueSet(callback);
        };
        drawer.open();
        drawer.onValueSet(callback);
    }

}
