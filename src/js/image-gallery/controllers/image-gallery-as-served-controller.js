/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

var AsServedSetModel = require("../models/as-served-set-model");

module.exports = function (app) {
    app.controller('ImageGalleryAsServed', ["$scope", "AsServedSetService", controllerFun]);
};

function controllerFun($scope, AsServedSetService) {

    $scope.items = [];
    $scope.searchQuery = '';
    $scope.copiedTags = [];
    $scope.showDeleted = false;

    $scope.toggleShowDeleted = function () {
        $scope.showDeleted = !$scope.showDeleted;
    };

    $scope.getFilteredItems = function () {
        return $scope.items.filter(function (item) {
            return [item.id, item.description].join(' ').search($scope.searchQuery) > -1 &&
                (!item.deleted || $scope.showDeleted);
        });
    };

    $scope.select = function (item) {
        item.selected = !item.selected;
    };

    $scope.selectAll = function () {
        $scope.getFilteredItems().forEach(function (item) {
            item.selected = true;
        });
    };

    $scope.deselectAll = function () {
        $scope.items.forEach(function (item) {
            item.selected = false;
        });
    };

    $scope.addItem = function () {
        $scope.imageSelectDrawer.isOpen = true;
        $scope.imageSelectDrawer.onImageSelected = addItemFromImage;
    };

    $scope.saveItem = function (item) {
        var promise;

        item.loading = true;

        if (item.id == undefined) {
            promise = AsServedService.add(123, item.newWeight).then(function (data) {
                item.id = data.id;
                item.acceptChanges();
            });
        } else {
            promise = AsServedService.edit(item.id, item.newSrc, item.newWeight).then(function (data) {
                item.acceptChanges();
            });
        }
        promise.finally(function () {
            item.loading = false;
        });
    };

    $scope.removeSelected = function () {
        if (!confirm("Are you sure you want to delete selected items?")) {
            return;
        }
        $scope.items.forEach(function (item) {
            if (!item.selected) {
                return;
            }
            removeItem(item);
        });
    };

    $scope.removeItem = function (image) {
        if (!confirm("Are you sure you want to delete this image?")) {
            return;
        }
        removeItem(image);
    };

    $scope.getItemsSelected = function () {
        return $scope.items.filter(function (item) {
                return item.selected;
            }).length > 0;
    };

    AsServedSetService.all().then(function (data) {
        $scope.items = data.map(function (item) {
            return new AsServedSetModel(item.id, item.description, item.deleted, item.images);
        });
    });

    function removeItem(item) {
        item.loading = true;
        AsServedSetService.remove(item.id).then(function () {
            var i = $scope.items.indexOf(item);
            $scope.items.splice(i, 1);
        });
    }

    function addItemFromImage(imageModel) {
        var newItem = new AsServedItemModel(undefined, imageModel.src, imageModel.tags, 0, false);
        newItem.edit();
        $scope.items.unshift(newItem);
        $scope.imageSelectDrawer.isOpen = false;
    }

}
