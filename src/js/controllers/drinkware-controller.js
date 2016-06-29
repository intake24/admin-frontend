'use strict';

module.exports = function (app) {
    app.controller('DrinkwareController', ['$scope', 'FoodDataReader', 'Drawers', controllerFun]);
};

function controllerFun($scope, foodDataReader, drawers) {

    var _resultObj = null;

    var _resultField = null;

    $scope.drinkwareSets = null;

    function reloadDrinkwareSets() {
        foodDataReader.getDrinkwareSets().then(function (drinkwareSets) {
                $scope.drinkwareSets = drinkwareSets;
            },
            $scope.handleError);
    }

    $scope.$on("intake24.admin.food_db.DrinkwareDrawerOpened", function (event, resultObj, resultField) {
        _resultObj = resultObj;
        _resultField = resultField;
    });

    $scope.$on("intake24.admin.LoggedIn", function (event) {
        reloadDrinkwareSets();
    });

    $scope.setDrinkwareSet = function (drinkware_set_id) {
        _resultObj[_resultField] = drinkware_set_id;
        drawers.hideDrawer();
    }

}
