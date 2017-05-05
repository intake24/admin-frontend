'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('AssociatedFoodDrawerController',
        ['$scope', '$timeout', '$routeParams', 'FoodService', 'DrawersService', 'LocalesService', controllerFun]);
};

function controllerFun($scope, $timeout, $routeParams, FoodService, DrawersService, LocalesService) {

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

          FoodService.searchFoods($routeParams.locale, $scope.query).then(function (data) {
              $scope.items = $scope.items.concat(data);
          });

          FoodService.searchCategories($routeParams.locale, $scope.query).then(function (data) {
              $scope.items = $scope.items.concat(data);
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
