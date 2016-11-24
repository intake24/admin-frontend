/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.controller("ImageGalleryAsServed", ["$scope", "AsServedSetService", controllerFun]);
};

function controllerFun($scope, AsServedSetService) {

    $scope.items = [];
    $scope.listIsLoading = true;
    $scope.searchQuery = "";

    $scope.getListIsNotEmpty = function () {
        return $scope.items.filter($scope.itemIsFiltered).length > 0 || $scope.listIsLoading;
    };

    $scope.itemIsFiltered = function (item) {
        return [item.id, item.description].join(" ").match(new RegExp($scope.searchQuery, "gi"));
    };

    $scope.onRemoved = function (id) {
        var item = $scope.items.filter(function (el) {
            return el.id == id;
        })[0];
        var i = $scope.items.indexOf(item);
        $scope.items.splice(i, 1);
    };

    $scope.addItem = function () {
        $scope.items.unshift(AsServedSetService.generateBlankItem());
    };

    AsServedSetService.all().then(function (data) {
        $scope.items = data;
    }).finally(function () {
        $scope.listIsLoading = false;
    });

}
