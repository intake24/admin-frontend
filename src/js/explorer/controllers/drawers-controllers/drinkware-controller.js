'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('DrinkwareController', ['$scope', 'FoodService', 'DrawersService', controllerFun]);
};

function controllerFun($scope, FoodService, DrawersService) {

    $scope.drinkwareSets = null;

    $scope.isOpen = DrawersService.drawerDrinkware.getOpen();

    function reloadDrinkwareSets() {
        FoodService.getDrinkwareSets().then(function (drinkwareSets) {
                $scope.drinkwareSets = _.values(drinkwareSets);
            },
            $scope.handleError);
    }

    $scope.$on("intake24.admin.LoggedIn", function (event) {
        reloadDrinkwareSets();
    });

    reloadDrinkwareSets();

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
