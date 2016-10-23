'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('AsServedSetController',
        ['$scope', 'FoodDataReader', 'DrawersService', controllerFun]);
};

function controllerFun($scope, foodDataReader, DrawersService) {

    $scope.asServedImageSets = null;

    $scope.isOpen = DrawersService.drawerAsServedImageSet.getOpen();

    function reloadAsServedSets() {
        foodDataReader.getAsServedImageSets().then(function (asServedSets) {
                $scope.asServedImageSets = _.values(asServedSets);
            },
            $scope.handleError);
    }

    $scope.$on("intake24.admin.LoggedIn", function (event) {
        reloadAsServedSets();
    });

    $scope.setAsServedImageSet = function (image_set_id) {
        DrawersService.drawerAsServedImageSet.setValue(image_set_id);
        this.close();
    };

    $scope.close = function () {
        DrawersService.drawerAsServedImageSet.close();
    };

    $scope.$watch(function () {
        return DrawersService.drawerAsServedImageSet.getOpen();
    }, function () {
        $scope.isOpen = DrawersService.drawerAsServedImageSet.getOpen();
    });

}