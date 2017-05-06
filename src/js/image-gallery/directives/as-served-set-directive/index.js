/**
 * Created by Tim Osadchiy on 01/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.directive("asServedSet", ["$timeout", "DrawersService", "AsServedSetService", "ImageService",
        directiveFun]);

    function directiveFun($timeout, DrawersService, AsServedSetService, ImageService) {

        function controller(scope, element, attributes) {

            scope.newName = scope.name;
            scope.newDescription = scope.description;
            scope.loading = false;
            scope.collapsed = true;

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
                var newItems = [];
                var callback = function (images) {
                    if (!images) {
                        return;
                    }
                    newItems.forEach(function (item) {
                        var i = scope.items.indexOf(item);
                        scope.items.splice(i, 1);
                    });
                    newItems = [];
                    images.forEach(function (image) {
                        var it = scope.items.filter(function (el) {
                            return el.sourceId == image.id;
                        })[0];
                        if (it) {
                            return;
                        }
                        var newItem = AsServedSetService.getImageObj(image.id, image.src);
                        scope.items.push(newItem);
                        newItems.push(newItem);
                    });
                };
                var unregister = scope.$watch(function () {
                    return DrawersService.imageDrawer.getOpen();
                }, function () {
                    if (!DrawersService.imageDrawer.getOpen()) {
                        DrawersService.imageDrawer.offValueSet(callback);
                        unregister();
                    }
                });
                DrawersService.imageDrawer.open();
                DrawersService.imageDrawer.onValueSet(callback);
            };

            scope.changeImage = function (item) {
                var callback = function (images) {
                    if (!images) {
                        return;
                    }
                    item.sourceId = images[0].id;
                    item.imageUrl = images[0].src;
                    DrawersService.imageDrawer.offValueSet(callback);
                    DrawersService.imageDrawer.close();
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

            scope.onFilesChange = function (fileList) {
                if (scope.collapsed) {
                    getDetails().then(function () {
                        $timeout(function() {
                            addItemsFromMultipleFiles(fileList);
                        });
                    });
                } else {
                    addItemsFromMultipleFiles(fileList);
                }
            };

            scope.$watch("name", function () {
                // If we don't set this watcher, the data from previously created set is copied to the new set.
                if (scope.name == "") {
                    rejectChanges();
                    scope.collapsed = false;
                }
            });

            function getDetails() {
                scope.loading = true;
                return AsServedSetService.get(scope.name).then(function (data) {
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
                promise.then(acceptChanges)
                    .finally(function () {
                        scope.loading = false;
                    });
            }

            function acceptChanges() {
                scope.name = scope.newName;
                scope.description = scope.newDescription;
                scope.collapsed = true;
            }

            function rejectChanges() {
                scope.newName = scope.name;
                scope.newDescription = scope.description;
                scope.collapsed = true;
            }

            function addItemsFromMultipleFiles(fileList) {
                for (var i = 0; i < fileList.length; i++) {
                    var file = fileList.item(i);
                    if (!file.type.match(/image.*/)) {
                        continue;
                    }
                    addItemFromFile(file);
                }
            }

            function addItemFromFile(file) {
                var image = AsServedSetService.getImageObj();
                image.loading = true;
                scope.items.unshift(image);
                ImageService.addForAsServed(scope.name, file).then(function (data) {
                    image.sourceId = data.id;
                    image.imageUrl = data.src;
                    image.loading = false;
                }, function () {
                    scope.removeItem(image);
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
                referenceObj: "=?",
                onRemoved: "=?"
            },
            template: require("./as-served-set-directive.html")
        };
    }

};