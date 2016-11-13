'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('AsServedSetController',
        ['$scope', 'FoodDataReaderService', 'DrawersService', controllerFun]);
};

function controllerFun($scope, FoodDataReaderService, DrawersService) {

    $scope.asServedImageSets = null;

    $scope.isOpen = DrawersService.drawerAsServedImageSet.getOpen();

    function reloadAsServedSets() {
        FoodDataReaderService.getAsServedImageSets().then(function (asServedSets) {
                $scope.asServedImageSets = _.values(asServedSets);
            },
            $scope.handleError);
    }

    $scope.$on("intake24.admin.LoggedIn", function (event) {
        reloadAsServedSets();
    });

    reloadAsServedSets();

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
