'use strict';

module.exports = function (app) {
    app.controller('PortionSizeItemController',
        ['$scope', 'DrawersService', controllerFun]);
};

function controllerFun($scope, DrawersService) {

    $scope.showAsServedImageSetDrawer = function (resultObj, resultField) {
        $scope.$broadcast("intake24.admin.food_db.AsServedSetDrawerOpened", resultObj, resultField);
        DrawersService.showDrawer("drawer-as-served-image-set");
    };

    $scope.showGuideImageDrawer = function (resultObj, resultField) {
        $scope.$broadcast("intake24.admin.food_db.GuideImageDrawerOpened", resultObj, resultField);
        DrawersService.showDrawer("drawer-guide-image");
    };

    $scope.showDrinkwareDrawer = function (resultObj, resultField) {
        $scope.$broadcast("intake24.admin.food_db.DrinkwareDrawerOpened", resultObj, resultField);
        DrawersService.showDrawer("drawer-drinkware");
    };

}