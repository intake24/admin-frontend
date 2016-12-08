/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.controller("ImageGalleryAsServed", ["$scope", "$window", "AsServedSetService", controllerFun]);
};

function controllerFun($scope, $window, AsServedSetService) {

    $scope.items = [];
    $scope.listIsLoading = true;
    $scope.searchQuery = "";

    $scope.getListIsNotEmpty = function () {
        return $scope.items.filter($scope.itemIsFiltered).length > 0 || $scope.listIsLoading;
    };

    $scope.itemIsFiltered = function (item) {
        return [item.id, item.description].join(" ").match(new RegExp($scope.searchQuery, "gi")) || item.id == "";
    };

    $scope.onRemoved = function (item) {
        var i = $scope.items.indexOf(item);
        $scope.items.splice(i, 1);
    };

    $scope.addItem = function () {
        var newItemExists = $scope.items.filter(function(item) {
            return item.id == "";
        }).length > 0;
        if (newItemExists) {
            return;
        }
        var newItem = AsServedSetService.getBlankItem();
        $scope.items.unshift(newItem);
        $window.scrollTo(0, 0);
    };

    AsServedSetService.all().then(function (data) {
        $scope.items = data;
    }).finally(function () {
        $scope.listIsLoading = false;
    });

}
