'use strict';

module.exports = function (app) {
    app.controller('AssociatedFoodDrawerController',
        ['$scope', 'FoodDataReader', 'DrawersService', controllerFun]);
};

function controllerFun($scope, FoodDataReaderService, DrawersService) {

    $scope.query = "";
    $scope.items = [];
    $scope.isOpen = DrawersService.drawerAssociatedFood.getOpen();

    $scope.$watch('query', function (newValue, oldValue) {
      $scope.items.length = 0;

      // #40: this triggering on load causes an error, the correct way to prevent
      // the watch from triggering on load seems to be checking if newValue == oldValue,
      // but in this case an empty query should not be sent to the server anyway

      if (query) {
        FoodDataReaderService.searchFoods($scope.query).then(function (data) {
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
