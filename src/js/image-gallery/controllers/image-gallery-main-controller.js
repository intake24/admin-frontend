/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

var ImageModel = require("../models/image-model");

module.exports = function (app) {
    app.controller('ImageGalleryMain', ["$scope", "ImageService", controllerFun]);
};

function controllerFun($scope, ImageService) {

    $scope.images = [];
    $scope.searchQuery = '';
    $scope.copiedTags = [];
    $scope.showDeleted = false;

    $scope.toggleShowDeleted = function () {
        $scope.showDeleted = !$scope.showDeleted;
    };

    $scope.getFilteredImages = function () {
        return $scope.images.filter(function (image) {
            return image.tags.join(' ').search($scope.searchQuery) > -1 &&
                (!image.deleted || $scope.showDeleted);
        });
    };

    $scope.onFilesChange = function (fileList) {
        for (var i = 0; i < fileList.length; i++) {
            var file = fileList.item(i);
            if (!file.type.match(/image.*/)) {
                continue;
            }
            readImageFromFile(file, function (img) {
                $scope.images.unshift(img);
                $scope.$apply();
            });
        }
    };

    $scope.select = function (item) {
        item.selected = !item.selected;
    };

    $scope.selectAll = function () {
        $scope.getFilteredImages().forEach(function (image) {
            image.selected = true;
        });
    };

    $scope.deselectAll = function () {
        $scope.images.forEach(function (image) {
            image.selected = false;
        });
    };

    $scope.removeSelected = function () {
        // Fixme: You can't remove deleted images
        if (!confirm("Are you sure you want to delete selected images?")) {
            return;
        }
        $scope.images.forEach(function (image) {
            if (!image.selected) {
                return;
            }
            removeItem(image);
        });
    };

    $scope.removeItem = function (image) {
        if (!confirm("Are you sure you want to delete this image?")) {
            return;
        }
        removeItem(image);
    };

    $scope.copyTags = function (image) {
        $scope.copiedTags = image.tags.slice();
    };

    $scope.pasteTagsToSelected = function () {
        if ($scope.copiedTags != undefined && $scope.copiedTags.length > 0) {
            $scope.getFilteredImages().forEach(function (image) {
                image.tags = $scope.copiedTags.slice();
            });
        }
    };

    $scope.getImagesSelected = function () {
        return $scope.images.filter(function (image) {
                return image.selected;
            }).length > 0;
    };

    ImageService.all().then(function (data) {
        $scope.images = data.map(function (image) {
            return new ImageModel(image.id, image.src, image.tags, image.deleted);
        });
    });

    function removeItem(image) {
        image.loading = true;
        ImageService.remove(image.id).then(function () {
            var i = $scope.images.indexOf(image);
            $scope.images.splice(i, 1);
        });
    }

}

function readImageFromFile(file, onLoad) {
    var reader = new FileReader(),
        image = new ImageModel();
    reader.onload = function (e) {
        image.src = e.target.result;
        if (onLoad) {
            onLoad(image);
        }
    };
    reader.readAsDataURL(file);
}