'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('PortionSizeController',
        ['$scope', 'SharedData', controllerFun]);
};

function controllerFun($scope, SharedData) {

    $scope.sharedData = SharedData;

    $scope.addPortionSize = function () {
        $scope.portionSizes.push({
            method: 'as-served',
            conversionFactor: 1,
            description: '',
            imageUrl: '',
            useForRecipes: false,
            parameters: {}
        });
    };

    $scope.deletePortionSize = function (index) {
        $scope.portionSizes.splice(index, 1);
    };

    $scope.$watch('$parent.itemDefinition.local.portionSize', function () {
        if ($scope.$parent.itemDefinition == null) {
            $scope.portionSizes = null;
            return;
        } else {
            $scope.portionSizes = $scope.$parent.itemDefinition.local.portionSize;
            $scope.$parent.$parent.portionSizeIsValid = _.all($scope.portionSizes, isPortionSizeMethodValid);
        }
    }, true);

    function isPortionSizeMethodValid(psm) {
        var generalParametersValid = psm.description != undefined && psm.description != '' && psm.imageUrl != undefined && psm.imageUrl != '';

        if (!generalParametersValid)
            return false;
        else {
            switch (psm.method) {
                case 'standard-portion':
                    return psm.parameters.units.length > 0 && _.all(psm.parameters.units, function (unit) {
                            return unit.name != '' && unit.value != '';
                        });
                case 'as-served':
                    return psm.parameters.serving_image_set != undefined && psm.parameters.serving_image_set != '' &&
                        (psm.parameters.leftovers_image_set != undefined && psm.parameters.leftovers_image_set != '' || !psm.parameters.useLeftoverImages);
                case 'guide-image':
                    return psm.parameters.guide_image_id != undefined && psm.parameters.guide_image_id != '';
                case 'cereal':
                    return psm.parameters.cereal_type != undefined && psm.parameters.cereal_type != '';
                case 'drink-scale':
                    return psm.parameters.drinkware_id != undefined && psm.parameters.initial_fill_level != undefined;
                case 'milk-on-cereal':
                    return true;
                case 'milk-in-a-hot-drink':
                    return true;
                case 'pizza':
                    return true;
                default:
                    throw controllerName + ': unexpected portion size method.'
            }
        }
    }
}
