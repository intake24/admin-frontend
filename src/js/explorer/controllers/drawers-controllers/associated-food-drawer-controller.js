'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('AssociatedFoodDrawerController',
        ['$scope', '$timeout', 'FoodDataReader', 'DrawersService', 'Packer', controllerFun]);
};

function controllerFun($scope, $timeout, FoodDataReaderService, DrawersService, packer) {

    $scope.query = "";
    $scope.items = [];
    $scope.isOpen = DrawersService.drawerAssociatedFood.getOpen();

    var searchDelay = 500;
    var searchTimeout = null;

    $scope.$watch('query', function (newValue, oldValue) {

      // #40: this triggering on load causes an error, the correct way to prevent
      // the watch from triggering on load seems to be checking if newValue == oldValue,
      // but in this case an empty query should not be sent to the server anyway

      if ($scope.query) {
        $timeout.cancel(searchTimeout);
        searchTimeout = $timeout(function() {
          $scope.items = [];

          FoodDataReaderService.searchFoods($scope.query).then(function (data) {
              $scope.items = $scope.items.concat(_.map(data, packer.unpackFoodHeader));
          });

          FoodDataReaderService.searchCategories($scope.query).then(function (data) {
              $scope.items = $scope.items.concat(_.map(data, packer.unpackCategoryHeader));
          });

        }, searchDelay);
      }
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
