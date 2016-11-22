/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.controller("ImageGalleryAsServed", ["$scope", "AsServedSetService", controllerFun]);
};

function controllerFun($scope, AsServedSetService) {

    $scope.items = [];
    $scope.searchQuery = "";

    $scope.onRemoved = function(id) {
        var item = $scope.items.filter(function(el) {
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
    });

}
