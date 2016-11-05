/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.controller('ImageGalleryAsServed', ["$scope", "AsServedSetService", controllerFun]);
};

function controllerFun($scope, AsServedSetService) {

    $scope.items = [];
    $scope.searchQuery = '';
    $scope.showDeleted = false;

    $scope.toggleShowDeleted = function () {
        $scope.showDeleted = !$scope.showDeleted;
    };

    $scope.getFilteredItems = function () {
        return $scope.items.filter(function (item) {
            var joinedImageTags = item.images.map(function (i) {
                return i.tags.join(" ");
            }).join(" ");

            return [item.id, item.description, joinedImageTags]
                    .join(" ").toLowerCase().search($scope.searchQuery) > -1 &&
                (!item.deleted || $scope.showDeleted);
        });
    };

    $scope.addItem = function () {
        $scope.items.unshift(AsServedSetService.generateBlankItem());
    };

    AsServedSetService.all().then(function (data) {
        $scope.items = data;
    });

}
