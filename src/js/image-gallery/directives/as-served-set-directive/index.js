/**
 * Created by Tim Osadchiy on 01/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.directive("asServedSet", ["DrawersService", "AsServedSetService",
        directiveFun]);

    function directiveFun(DrawersService, AsServedSetService) {

        function controller(scope, element, attributes) {

            scope.newName = scope.name;
            scope.newDescription = scope.description;
            scope.loading = false;
            scope.collapsed = scope.name != "";

            scope.toggle = function () {
                if (scope.collapsed) {
                    getDetails();
                } else {
                    update();
                }
            };

            scope.addItem = function () {
                if (scope.collapsed) {
                    scope.toggle();
                }
                var callback = function (value) {
                    if (!value) {
                        return;
                    }
                    var newItem = AsServedSetService.generateBlankImage(value.id, value.src);
                    scope.items.push(newItem);
                    DrawersService.imageDrawer.offValueSet(callback);
                };
                DrawersService.imageDrawer.open();
                DrawersService.imageDrawer.onValueSet(callback);
            };

            scope.changeImage = function (item) {
                var callback = function (value) {
                    if (!value) {
                        return;
                    }
                    item.sourceId = value.id;
                    item.imageUrl = value.src;
                    DrawersService.imageDrawer.offValueSet(callback);
                };
                DrawersService.imageDrawer.open();
                DrawersService.imageDrawer.onValueSet(callback);
            };

            scope.removeItem = function (item) {
                var i = scope.items.indexOf(item);
                scope.items.splice(i, 1);
            };

            scope.removeSet = function () {
                if (!confirm("Are you sure you want to delete this set?")) {
                    return;
                }
                scope.loading = true;
                AsServedSetService.remove(scope.name).then(function () {
                    if (scope.onRemoved) {
                        scope.onRemoved(scope.referenceObj);
                    }
                }).finally(function () {
                    scope.loading = false;
                });
            };

            scope.cancel = function () {
                scope.collapsed = true;
                if (scope.name != "") {
                    rejectChanges();
                } else if (scope.onRemoved) {
                    scope.onRemoved(scope.referenceObj);
                }
            };

            scope.getNotValid = function () {
                var nameIsNotValid = scope.newName.replace(/\s+/gi, "") == "",
                    descriptionIsNotValid = scope.newDescription.replace(/\s+/gi, "") == "";
                return nameIsNotValid || descriptionIsNotValid ||
                    (scope.items != undefined && scope.items.length == 0);
            };

            function getDetails() {
                scope.loading = true;
                AsServedSetService.get(scope.name).then(function (data) {
                    scope.items = data.images;
                    scope.collapsed = false;
                }).then(function () {
                    scope.loading = false;
                });
            }

            function update() {
                var promise;
                if (scope.getNotValid()) {
                    return;
                }
                var images = scope.items.map(function (item) {
                    return {
                        sourceImageId: item.sourceId,
                        weight: item.weight
                    };
                });

                scope.loading = true;
                if (scope.name == "") {
                    promise = AsServedSetService.add(scope.newName, scope.newDescription, images);
                } else {
                    promise = AsServedSetService.patch(scope.name, scope.newName, scope.newDescription, images);
                }
                promise.then(acceptChanges, rejectChanges)
                    .then(function () {
                        scope.collapsed = true;
                    })
                    .finally(function () {
                        scope.loading = false;
                    });
            }

            function acceptChanges() {
                scope.name = scope.newName;
                scope.description = scope.newDescription;
            }

            function rejectChanges() {
                scope.newName = scope.name;
                scope.newDescription = scope.description;
            }

        }

        return {
            restrict: "E",
            link: controller,
            scope: {
                name: "=?",
                description: "=?",
                items: "=?",
                referenceObj: "=?",
                onRemoved: "=?"
            },
            template: require("./as-served-set-directive.html")
        };
    }

};