/**
 * Created by Tim Osadchiy on 29/10/2016.
 */

'use strict';

var ImageModel = require("../../controllers/image-gallery-main-controller/image-model");

module.exports = function (app) {
    app.directive("imageSelectDrawer", ["$window", "$timeout", "ImageService", "DrawersService", directiveFun]);

    function directiveFun($window, $timeout, ImageService, DrawersService) {

        function controller(scope, element, attributes) {

            var LIMIT = 10,
                SEARCH_DELAY = 500;

            var page = 0,
                loadImagesTimeout;

            scope.items = [];
            scope.selectedItems = [];
            scope.loadingImages = false;
            scope.title = $window.gettext("drawers_images_title");
            scope.placeholder = $window.gettext("drawers_images_query_placeholder");
            scope.searchQuery = "";

            scope.close = function () {
                DrawersService.imageDrawer.close();
            };

            scope.select = function (item) {
                if (scope.multiple) {
                    item.selected = !item.selected;
                    var img = scope.selectedItems.filter(function (el) {
                        return el.id === item.id;
                    })[0];
                    if (img !== undefined) {
                        var i = scope.selectedItems.indexOf(img);
                        scope.selectedItems.splice(i, 1);
                    } else {
                        scope.selectedItems.push(item);
                    }
                    DrawersService.imageDrawer.setValue(angular.copy(scope.selectedItems));
                } else {
                    scope.selectedItems.push(item);
                    DrawersService.imageDrawer.setValue(angular.copy(scope.selectedItems));
                    scope.close();
                }
            };

            scope.getItemIsSelected = function (item) {
                var img = scope.selectedItems.filter(function (el) {
                    return el.id == item.id;
                })[0];
                return img != undefined;
            };

            scope.loadItems = function () {
                scope.loadingImages = true;
                $timeout.cancel(loadImagesTimeout);
                loadImagesTimeout = $timeout(loadItems, SEARCH_DELAY);
            };

            scope.$watch("searchQuery", function () {
                scope.items.length = 0;
                page = 0;
                scope.loadItems();
            });

            scope.$watch(function () {
                return DrawersService.imageDrawer.getOpen();
            }, function () {
                scope.isOpen = DrawersService.imageDrawer.getOpen();
                if (!scope.isOpen) {
                    refresh();
                }
            });

            function refresh() {
                scope.selectedItems = [];
            }

            function loadItems() {
                ImageService.query(page * LIMIT, LIMIT, scope.searchQuery).then(function (data) {
                    Array.prototype.push.apply(scope.items, data.map(function (image) {
                        return new ImageModel(image.id, image.fixedSizeUrl, image.keywords);
                    }));
                    // Increment page only if data came. If the data length is 0, try to reload it next time
                    if (data.length) {
                        page++;
                    }
                }).finally(function () {
                    scope.loadingImages = false;
                });
            }
        }

        return {
            restrict: "E",
            link: controller,
            scope: {
                multiple: "=?"
            },
            template: require("./image-select-drawer-directive.html")
        };
    }

};
