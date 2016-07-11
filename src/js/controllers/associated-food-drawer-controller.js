'use strict';

module.exports = function (app) {
    app.controller('AssociatedFoodDrawerController',
        ['$scope', 'FoodDataReader', 'DrawersService', controllerFun]);
};

function controllerFun($scope, FoodDataReaderService, DrawersService) {

    $scope.query = "";
    $scope.items = [];
    $scope.isOpen = DrawersService.drawerAssociatedFood.getOpen();

    $scope.$watch('query', function () {
        FoodDataReaderService.searchFoods($scope.query).then(function (data) {
            $scope.items.length = 0;
            Array.prototype.push.apply($scope.items, data);
        });
    });

    $scope.select = function (drinkware_set_id) {
        DrawersService.drawerAssociatedFood.setValue(drinkware_set_id);
        this.close();
    };

    $scope.close = function () {
        DrawersService.drawerAssociatedFood.close();
    };

    $scope.$watch(function () {
        return DrawersService.drawerAssociatedFood.getOpen();
    }, function () {
        $scope.isOpen = DrawersService.drawerAssociatedFood.getOpen();
    });

}