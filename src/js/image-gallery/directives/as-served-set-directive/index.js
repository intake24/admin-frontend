/**
 * Created by Tim Osadchiy on 01/11/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('asServedSet', ["DrawersService", directiveFun]);

    function directiveFun(DrawersService) {

        function controller(scope, element, attributes) {

            scope.newName = scope.name;
            scope.newDescription = scope.description;
            scope.loading = false;
            scope.edited = false;
            scope.deleted = scope.deleted || false;

            scope.select = function (item) {
                item.selected = !item.selected;
            };

            scope.changeImage = function (item) {
                DrawersService.imageDrawer.open();
                var unregister = scope.$watch(function () {
                    return DrawersService.imageDrawer.getValue();
                }, function () {
                    item.newSrc = imageModel.src;
                    scope.saveItem(item);
                    unregister();
                });
            };

            scope.removeItem = function (item) {
                if (!confirm("Are you sure you want to delete this image?")) {
                    return;
                }
                item.loading = true;
                AsServedService.remove(item.id).then(function () {
                    var i = $scope.items.indexOf(item);
                    scope.items.splice(i, 1);
                });
            };

        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                name: "=?",
                description: "=?",
                items: "=?",
                selected: "=?"
            },
            templateUrl: 'src/js/image-gallery/directives/as-served-set-directive/as-served-set-directive.html'
        };
    }

};