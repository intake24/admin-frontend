/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

var ImageModel = require("./image-model");

module.exports = function (app) {
    app.controller('ImageGalleryMain', ["$scope", "$timeout", "ImageService", controllerFun]);
};

function controllerFun($scope, $timeout, ImageService) {

    var LIMIT = 10,
        SEARCH_DELAY = 500;

    var page = 0,
        searchPage = 0,
        previousLoadedImagePage = undefined,
        previousLoadedSearchPage = undefined,
        searchTimeout;

    $scope.images = [];
    $scope.searchedImages = [];
    $scope.searchQuery = "";
    $scope.copiedTags = [];
    $scope.showDeleted = false;
    $scope.loadingImages = false;

    $scope.toggleShowDeleted = function () {
        $scope.showDeleted = !$scope.showDeleted;
    };

    $scope.getFilteredImages = function () {
        return $scope.images.filter(function (image) {
            return image.tags.join(' ').toLowerCase().search($scope.searchQuery) > -1 &&
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

    $scope.restoreItem = function (item) {
        if (!confirm("Are you sure you want to restore this image?")) {
            return;
        }
        item.loading = true;
        ImageService.restore(item.id).then(function (data) {
            item.deleted = false;
        }).finally(function () {
            item.loading = false;
        });
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

    $scope.loadImages = loadImages;
    $scope.searchImages = searchImages;

    $scope.getSearchQueryNotEmpty = function () {
        return $scope.searchQuery.replace(/\s+/gi, "") != "";
    };

    $scope.$watch("searchQuery", function () {
        if (!$scope.getSearchQueryNotEmpty()) {
            $scope.searchedImages.length = 0;
        } else {
            $timeout.cancel(searchTimeout);
            searchTimeout = $timeout(searchImages, SEARCH_DELAY);
        }
    });

    loadImages();

    function loadImages() {
        $scope.loadingImages = true;
        ImageService.query(page * LIMIT, LIMIT).then(function (data) {
            if (previousLoadedImagePage != page) {
                Array.prototype.push.apply($scope.images, data.map(function (image) {
                    return new ImageModel(image.id, image.fixedSizeUrl, image.keywords);
                }));
            }
            previousLoadedImagePage = page;
            if (data.length) {
                page++;
            }
        }).finally(function () {
            $scope.loadingImages = false;
        });
    }

    function searchImages() {
        $scope.loadingImages = true;
        ImageService.query(searchPage * LIMIT, LIMIT, $scope.searchQuery).then(function (data) {
            if (previousLoadedSearchPage != searchPage) {
                Array.prototype.push.apply($scope.searchedImages, data.map(function (image) {
                    return new ImageModel(image.id, image.fixedSizeUrl, image.keywords);
                }));
            }
            previousLoadedSearchPage = searchPage;
            if (data.length) {
                searchPage++;
            }
        }).finally(function () {
            $scope.loadingImages = false;
        });
    }

    function removeItem(image) {
        image.loading = true;
        ImageService.remove(image.id).then(function () {
            image.deleted = true;
        }).finally(function () {
            image.loading = false;
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

