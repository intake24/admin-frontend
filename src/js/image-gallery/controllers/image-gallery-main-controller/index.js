/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

var ImageModel = require("./image-model");

module.exports = function (app) {
    app.controller('ImageGalleryMain', ["$scope", "$window", "$timeout", "ImageService", controllerFun]);
};

function controllerFun($scope, $window, $timeout, ImageService) {

    var LIMIT = 10,
        SEARCH_DELAY = 500;

    var page = 0,
        pageOffset = 0,
        loadImagesTimeout;

    $scope.images = [];
    $scope.searchQuery = "";
    $scope.copiedTags = [];
    $scope.loadingImages = false;

    $scope.onFilesChange = function (fileList) {
        for (var i = 0; i < fileList.length; i++) {
            var file = fileList.item(i);
            if (!file.type.match(/image.*/)) {
                continue;
            }
            var image = new ImageModel();
            image.loading = true;
            $scope.images.unshift(image);
            ImageService.add(file).then(function (data) {
                image.src = data.src;
                image.loading = false;
                pageOffset++;
            }, function () {
                removeItem(image);
            });
        }
        $window.scrollTo(0, 0);
    };

    $scope.select = function (item) {
        item.selected = !item.selected;
    };

    $scope.selectAll = function () {
        $scope.images.forEach(function (image) {
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
        var selectedImages = $scope.images.filter(function (el) {
            return el.selected;
        });
        selectedImages.forEach(function (image) {
            image.loading = true;
        });
        ImageService.remove(selectedImages.map(function (image) {
            return image.id;
        })).then(function () {
            pageOffset -= selectedImages.length;
            loadNImages(selectedImages.length);
            selectedImages.forEach(removeItem);
        }).finally(function () {
            selectedImages.forEach(function (image) {
                image.loading = false;
            });
        });
    };

    $scope.onRemoved = function (id) {
        var item = $scope.images.filter(function (el) {
            return el.id == id;
        })[0];
        removeItem(item);
        pageOffset--;
        loadNImages(1);
    };

    $scope.onTagsCopied = function (tags) {
        $scope.copiedTags = tags;
    };

    $scope.pasteTagsToSelected = function () {
        if ($scope.copiedTags != undefined && $scope.copiedTags.length > 0) {
            $scope.images.forEach(function (image) {
                if (image.selected) {
                    image.tags = $scope.copiedTags.slice();
                }
            });
        }
    };

    $scope.getImagesSelected = function () {
        return $scope.images.filter(function (image) {
                return image.selected;
            }).length > 0;
    };

    $scope.loadImages = function () {
        if ($scope.loadingImages) {
            return;
        }
        $timeout.cancel(loadImagesTimeout);
        $scope.loadingImages = true;
        loadImagesTimeout = $timeout(loadImages, SEARCH_DELAY);
    };

    $scope.$watch("searchQuery", function () {
        $scope.images.length = 0;
        page = 0;
        pageOffset = 0;
        $scope.loadImages();
    });

    loadImages();

    function loadNImages(n) {
        ImageService.query(page * LIMIT + pageOffset, n, $scope.searchQuery).then(function (data) {
            getImageModelsFromServerData(data);
            // Increment page only if data came. If the data length is 0, try to reload it next time
            if (data.length) {
                pageOffset += n;
            }
        }).finally(function () {
            $scope.loadingImages = false;
        });
    }

    function loadImages() {
        ImageService.query(page * LIMIT + pageOffset, LIMIT, $scope.searchQuery).then(function (data) {
            getImageModelsFromServerData(data);
            // Increment page only if data came. If the data length is 0, try to reload it next time
            if (data.length) {
                page++;
            }
        }).finally(function () {
            $scope.loadingImages = false;
        });
    }

    function getImageModelsFromServerData(data) {
        Array.prototype.push.apply($scope.images, data.map(function (image) {
            return new ImageModel(image.id, image.fixedSizeUrl, image.keywords);
        }));
    }

    function removeItem(image) {
        var i = $scope.images.indexOf(image);
        $scope.images.splice(i, 1);
    }

}

