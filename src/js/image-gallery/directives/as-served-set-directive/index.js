/**
 * Created by Tim Osadchiy on 01/11/2016.
 */

'use strict';

var AsServedItemModel = require("./as-served-item-model");

module.exports = function (app) {
    app.directive('asServedSet', ["DrawersService", "AsServedService", directiveFun]);

    function directiveFun(DrawersService, AsServedService) {

        function controller(scope, element, attributes) {

            scope.newName = scope.name;
            scope.newDescription = scope.description;
            scope.loading = false;
            scope.edited = false;
            scope.deleted = scope.deleted || false;

            scope.getFilteredItems = function() {
                return scope.items.filter(function(el) {
                    return !el.deleted || scope.showDeleted;
                });
            };

            scope.addItem = function () {
                DrawersService.imageDrawer.open();
                var unregister = scope.$watch(function () {
                    return DrawersService.imageDrawer.getValue();
                }, function (newValue) {
                    if (!newValue) {
                        return;
                    }
                    unregister();
                    var newItem = AsServedService.generateNewItem(newValue.src, newValue.tags);
                    newItem.asServedItemModel = new AsServedItemModel(newItem);
                    newItem.asServedItemModel.edit();
                    scope.items.unshift(newItem);
                    DrawersService.imageDrawer.setValue(undefined);
                });
            };

            scope.changeImage = function (item) {
                DrawersService.imageDrawer.open();
                var unregister = scope.$watch(function () {
                    return DrawersService.imageDrawer.getValue();
                }, function (imageModel) {
                    if (!imageModel) {
                        return;
                    }
                    unregister();
                    item.asServedItemModel.newSrc = imageModel.src;
                    item.asServedItemModel.newTags = imageModel.tags;
                    scope.saveItem(item);
                    DrawersService.imageDrawer.setValue(undefined);
                });
            };

            scope.saveItem = function (item) {
                var promise;

                item.asServedItemModel.loading = true;

                if (item.id == undefined) {
                    promise = AsServedService
                        .add(123, item.asServedItemModel.newWeight).then(function (data) {
                            item.id = data.id;
                            item.asServedItemModel.acceptChanges();
                        });
                } else {
                    promise = AsServedService.edit(item.id,
                        item.asServedItemModel.newSrc,
                        item.asServedItemModel.newWeight)
                        .then(function (data) {
                            item.asServedItemModel.acceptChanges();
                        });
                }
                promise.finally(function () {
                    item.asServedItemModel.loading = false;
                });
            };

            scope.removeItem = function (item) {
                if (!confirm("Are you sure you want to delete this image?")) {
                    return;
                }
                item.asServedItemModel.loading = true;
                AsServedService.remove(item.id).then(function () {
                    var i = scope.items.indexOf(item);
                    scope.items.splice(i, 1);
                });
            };

            scope.$watch('items', function () {
                scope.items.forEach(function (item) {
                    if (!item.asServedItemModel) {
                        item.asServedItemModel = new AsServedItemModel(item);
                    }
                });
            });

        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                name: "=?",
                description: "=?",
                items: "=?",
                selected: "=?",
                showDeleted: "=?"
            },
            templateUrl: 'src/js/image-gallery/directives/as-served-set-directive/as-served-set-directive.html'
        };
    }

};