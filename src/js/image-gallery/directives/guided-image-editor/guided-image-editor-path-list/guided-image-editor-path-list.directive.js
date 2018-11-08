/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

var textFieldIsNotEmpty = require("../../../../core/utils/text-is-not-empty");

module.exports = function (app) {
    app.directive("guidedImageEditorPathList", ["GuidedImageEditorCanvasService",
        "GuideImagesService", directiveFun]);

    function directiveFun(GuidedImageEditorCanvasService, GuideImagesService) {

        function controller(scope, element, attributes) {

            var _changed = false;
            var _imageWidth = null;
            var _imageHeight = null;

            scope.loading = false;

            scope.addPath = function () {
                scope.objects.push(getBlankObject([], scope.objects.length));
                scope.selectPath(scope.objects.length - 1);
            };

            scope.moveUp = function(index) {
                if (index > 0)
                {
                    var tmp = scope.objects[index-1];
                    scope.objects[index-1] = scope.objects[index];
                    scope.objects[index] = tmp;
                }
            };

            scope.moveDown = function(index) {
                if (index < (scope.objects.length - 1))
                {
                    var tmp = scope.objects[index+1];
                    scope.objects[index+1] = scope.objects[index];
                    scope.objects[index] = tmp;
                }
            };

            scope.removePath = function (index) {
                scope.objects.splice(index, 1);
            };

            scope.selectPath = function (index) {
                scope.selectedIndex = index;
            };

            scope.highlightsPath = function (index) {
                scope.hoveredIndex = index;
            };

            scope.removeAll = function () {
                scope.objects.length = 0;
            };

            scope.recognisePaths = function () {
                var conf = scope.objects.length == 0 ||
                    confirm("There are paths already created. Do you want to add more?");
                if (conf) {
                    GuidedImageEditorCanvasService.recognisePaths();
                }
            };

            scope.fieldIsNotEmpty = textFieldIsNotEmpty;

            scope.weightIsValid = weightIsValid;

            scope.saveIsActive = function () {
                return _changed && objectsAreValid.call(scope) &&
                    !scope.loading &&
                    scope.guideImageId != null;
            };

            scope.viewIsDisabled = function () {
                return scope.guideImageId == null;
            };


            scope.getIndex = function (item) {
                return scope.objects.indexOf(item);
            };

            scope.save = function () {
                if (!scope.saveIsActive()) {
                    return;
                }
                var data = {
                    imageWidth: _imageWidth,
                    imageHeight: _imageHeight,
                    objects: scope.objects
                };
                scope.loading = true;
                GuideImagesService.patchObjects(scope.guideImageId, data)
                    .finally(function () {
                        scope.loading = false;
                    })
            };

            scope.$watch("selectedIndex", function (newVal) {
                var selectedItem = scope.objects[newVal];
                if (selectedItem != null) {
                    scope.selectedItem = selectedItem;
                }
            });

            scope.$watch("objects", function (newVal, oldVal) {
                if (newVal != oldVal) {
                    if (oldVal.length > 0) {
                        _changed = true;
                    }
                    if (newVal.length != oldVal.length) {
                        notifyCanvas();
                    }
                }
            }, true);

            GuidedImageEditorCanvasService.registerOutWatchers(function (data) {
                var coordinates = data.coordinates;
                _imageWidth = data.imageWidth;
                _imageHeight = data.imageHeight;
                if (!newCoordinatesEqual(scope, coordinates)) {
                    _changed = true;
                    coordinates.forEach(function (c, i) {
                        var ob = scope.objects[i];
                        if (ob == null) {
                            scope.objects.push(getBlankObject(c, scope.objects.length));
                        } else {
                            ob.outlineCoordinates = c;
                        }
                    });
                    scope.$apply();
                }
            });

            function notifyCanvas() {
                var coords = scope.objects.map(function (item) {
                    return item.outlineCoordinates;
                });
                GuidedImageEditorCanvasService.updatePathsIn(coords);
            }
        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                guideImageId: "=?",
                selectedIndex: "=?",
                hoveredIndex: "=?",
                objects: "=?"
            },
            template: require("./guided-image-editor-path-list.directive.html")
        };
    }

};

function getBlankObject(coordinates, navigationIndex) {
    return {
        id: [],
        weight: 0,
        description: "",
        outlineCoordinates: coordinates,
        navigationIndex: navigationIndex
    }
}

function newCoordinatesEqual(scope, coordinates) {
    var oldCoords = scope.objects.map(function (i) {
        return i.outlineCoordinates.map(function (c) {
            return c.join(" ");
        }).join(" ");
    }).join(" ");
    var newCoords = coordinates.map(function (coordsSet) {
        return coordsSet.map(function (coord) {
            return coord.join(" ");
        }).join(" ");
    }).join(" ")
    return oldCoords == newCoords;
}

function weightIsValid(val) {
    return val > 0;
}

function objectsAreValid() {
    var scope = this;
    return scope.objects.filter(function (item) {
        return weightIsValid(item.weight) &&
            textFieldIsNotEmpty(item.description) &&
            item.outlineCoordinates.length > 0;
    }).length == scope.objects.length;
}


