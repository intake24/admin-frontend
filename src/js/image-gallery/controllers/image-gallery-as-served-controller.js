/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

var AsServedItemModel = require("../models/as-served-item-model"),
    ImageModel = require("../models/image-model");

module.exports = function (app) {
    app.controller('ImageGalleryAsServed', ["$scope", "ImageService", "AsServedService", controllerFun]);
};

function controllerFun($scope, ImageService, AsServedService) {

    $scope.items = [];
    $scope.searchQuery = '';
    $scope.copiedTags = [];
    $scope.showDeleted = false;

    $scope.imageSelectDrawer = {
        items: [],
        isOpen: false,
        selectedItem: undefined,
        onImageSelected: undefined
    };

    $scope.toggleShowDeleted = function () {
        $scope.showDeleted = !$scope.showDeleted;
    };

    $scope.getFilteredItems = function () {
        return $scope.items.filter(function (item) {
            return item.tags.join(' ').search($scope.searchQuery) > -1 &&
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

    $scope.changeImage = function(item) {
        $scope.imageSelectDrawer.isOpen = true;
        $scope.imageSelectDrawer.onImageSelected = function(imageModel) {
            item.newSrc = imageModel.src;
            $scope.imageSelectDrawer.isOpen = false;
            $scope.saveItem(item);
        };
    };

    $scope.getItemsSelected = function () {
        return $scope.items.filter(function (item) {
                return item.selected;
            }).length > 0;
    };

    ImageService.all().then(function (data) {
        $scope.imageSelectDrawer.items = data.map(function (image) {
            return new ImageModel(image.id, image.src, image.tags, image.deleted);
        }).filter(function (image) {
            return !image.deleted;
        });
    });

    AsServedService.all().then(function (data) {
        $scope.items = data.map(function (item) {
            return new AsServedItemModel(item.id, item.src, item.tags, item.weight, item.deleted);
        });
    });

    function removeItem(item) {
        item.loading = true;
        AsServedService.remove(item.id).then(function () {
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
