/**
 * Created by Tim Osadchiy on 29/10/2016.
 */

'use strict';

var ImageModel = require("../../controllers/image-gallery-main-controller/image-model");

module.exports = function (app) {
    app.directive("imageSelectDrawer", ["$window", "ImageService", "DrawersService", directiveFun]);

    function directiveFun($window, ImageService, DrawersService) {

        function controller(scope, element, attributes) {
            scope.title = $window.gettext("drawers_images_title");
            scope.placeholder = $window.gettext("drawers_images_query_placeholder");
            scope.searchQuery = "";

            scope.close = function () {
                scope.isOpen = false;
                DrawersService.imageDrawer.close();
            };

            scope.select = function (item) {
                scope.selectedItem = item;
                DrawersService.imageDrawer.setValue(angular.copy(item));
                scope.close();
            };

            scope.getFilteredItems = function () {
                return scope.items.filter(function (item) {
                    return item.tags.join(' ').search(scope.searchQuery) > -1;
                });
            };

            scope.$watch(function() {
                return DrawersService.imageDrawer.getOpen();
            }, function() {
                scope.isOpen = DrawersService.imageDrawer.getOpen();
            });

            ImageService.query(0,100).then(function (data) {
                scope.items = data.map(function (image) {
                    return new ImageModel(image.id, image.fixedSizeUrl, image.keywords);
                });
            });
        }

        return {
            restrict: "E",
            link: controller,
            scope: {},
            template: require("./image-select-drawer-directive.html")
        };
    }

};
