/**
 * Created by Tim Osadchiy on 01/11/2016.
 */

"use strict";

var AsServedItemModel = require("./as-served-item-model");

module.exports = function (app) {
    app.directive("asServedSet", ["$timeout", "DrawersService", "AsServedSetService", "AsServedService",
        directiveFun]);

    function directiveFun($timeout, DrawersService, AsServedSetService, AsServedService) {

        function controller(scope, element, attributes) {

            var updateTimeout,
                updateAfter = 500;

            scope.newName = scope.name;
            scope.newDescription = scope.description;
            scope.loading = false;
            scope.collapsed = true;

            scope.toggle = function () {
                scope.collapsed = !scope.collapsed;
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
                    var newItem = AsServedService.generateBlankItem(newValue.src, newValue.tags);
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
                    var i = items.indexOf(item);
                    items.splice(i, 1);
                }).finally(function () {
                    item.asServedItemModel.loading = false;
                });
            };

            scope.removeSet = function () {
                if (!confirm("Are you sure you want to delete this set?")) {
                    return;
                }
                scope.loading = true;
                AsServedSetService.remove(scope.name).then(function () {
                    if (scope.onRemoved) {
                        scope.onRemoved(scope.name);
                    }
                }).finally(function () {
                    scope.loading = false;
                });
            };

            scope.$watch("items", function () {
                if (scope.items == undefined) {
                    return;
                }
                scope.items.forEach(function (item) {
                    if (!item.asServedItemModel) {
                        item.asServedItemModel = new AsServedItemModel(item);
                    }
                });
            });

            scope.$watch("[name, description]", function (newValue, oldValue) {
                $timeout.cancel(updateTimeout);
                updateTimeout = $timeout(function () {
                    update(newValue, oldValue);
                }, updateAfter);
            });

            function update(newValue, oldValue) {
                if (newValue[0] == oldValue[0] && newValue[1] == oldValue[1]) {
                    return;
                }
                var checkedName = scope.name.replace(/\s+/gi, "") == "",
                    checkedDescription = scope.description.replace(/\s+/gi, "") == "";
                if (checkedName || checkedDescription) {
                    return;
                }
                scope.loading = true;
                AsServedSetService.edit(scope.name, scope.description).finally(function () {
                    scope.loading = false;
                });
            }

        }

        return {
            restrict: "E",
            link: controller,
            scope: {
                name: "=?",
                description: "=?",
                items: "=?",
                onRemoved: "=?"
            },
            template: require("./as-served-set-directive.html")
        };
    }

};