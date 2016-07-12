'use strict';

module.exports = function (app) {
    app.controller('PortionSizeItemController',
        ['$scope', 'DrawersService', controllerFun]);
};

function controllerFun($scope, DrawersService) {

    var selectedItem = null,
        targetField = undefined;

    $scope.selectServingImageSet = function (resultObj) {
        selectedItem = resultObj;
        targetField = 'serving_image_set';
        DrawersService.drawerAsServedImageSet.open();
    };

    $scope.selectLeftoversImageSet = function (resultObj) {
        selectedItem = resultObj;
        targetField = 'leftovers_image_set';
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

}