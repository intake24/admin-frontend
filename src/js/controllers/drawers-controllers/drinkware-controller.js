'use strict';

module.exports = function (app) {
    app.controller('DrinkwareController', ['$scope', 'FoodDataReader', 'DrawersService', controllerFun]);
};

function controllerFun($scope, foodDataReader, DrawersService) {

    $scope.drinkwareSets = null;

    $scope.isOpen = DrawersService.drawerDrinkware.getOpen();

    function reloadDrinkwareSets() {
        foodDataReader.getDrinkwareSets().then(function (drinkwareSets) {
                $scope.drinkwareSets = drinkwareSets;
            },
            $scope.handleError);
    }

    $scope.$on("intake24.admin.LoggedIn", function (event) {
        reloadDrinkwareSets();
    });

    $scope.setDrinkwareSet = function (drinkware_set_id) {
        DrawersService.drawerDrinkware.setValue(drinkware_set_id);
        this.close();
    };

    $scope.close = function () {
        DrawersService.drawerDrinkware.close();
    };

    $scope.$watch(function () {
        return DrawersService.drawerDrinkware.getOpen();
    }, function () {
        $scope.isOpen = DrawersService.drawerDrinkware.getOpen();
    });

}
