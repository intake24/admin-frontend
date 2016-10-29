/**
 * Created by Tim Osadchiy on 29/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive("imageSelectDrawer", ["$window", directiveFun]);

    function directiveFun($window) {

        function controller(scope, element, attributes) {
            scope.title = $window.gettext("modals_associated_food_title");
            scope.placeholder = $window.gettext("modals_associated_food_query_placeholder");
            scope.searchQuery = "";

            scope.close = function () {
                scope.isOpen = false;
            };

            scope.select = function (item) {
                scope.selectedItem = item;
                if (scope.onImageSelected) {
                    scope.onImageSelected(item);
                }
            };

            scope.getFilteredItems = function () {
                return scope.items.filter(function (item) {
                    return item.tags.join(' ').search(scope.searchQuery) > -1;
                });
            };
        }

        return {
            restrict: "E",
            link: controller,
            transclude: true,
            scope: {
                isOpen: "=?",
                selectedItem: "=?",
                onImageSelected: "=?",
                items: "=?"
            },
            templateUrl: "src/js/image-gallery/directives/image-select-drawer-directive/image-select-drawer-directive.html"
        };
    }

};
