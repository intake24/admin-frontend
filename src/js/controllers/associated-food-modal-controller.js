'use strict';

module.exports = function (app) {
    app.controller('AssociatedFoodModalController', ['$scope', 'FoodDataReader', 'Drawers', controllerFun]);
};

function controllerFun($scope, FoodDataReaderService, drawers) {

    var _resultObj = null;

    var _resultField = null;

    $scope.query = "";
    $scope.items = [];

    $scope.$watch('query', function () {
        FoodDataReaderService.searchFoods($scope.query).then(function (data) {
            $scope.items.length = 0;
            Array.prototype.push.apply($scope.items, data);
        });
    });

    $scope.$on("intake24.admin.food_db.AssociatedFoodModalOpened", function (event, resultObj, resultField) {
        _resultObj = resultObj;
        _resultField = resultField;
    });

    $scope.setDrinkwareSet = function (drinkware_set_id) {
        _resultObj[_resultField] = drinkware_set_id;
        drawers.hideDrawer();
    }

}