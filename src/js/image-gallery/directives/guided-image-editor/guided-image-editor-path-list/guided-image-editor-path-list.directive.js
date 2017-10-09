/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

var textFieldIsNotEmpty = require("../../../../core/utils/text-is-not-empty");

module.exports = function (app) {
    app.directive("guidedImageEditorPathList", ["GuidedImageEditorCanvasService", directiveFun]);

    function directiveFun(GuidedImageEditorCanvasService) {

        function controller(scope, element, attributes) {

            var _changed = false;

            scope.selectedItem = null;

            scope.selectPath = function (item) {
                var index = scope.getIndex(item);
                scope.selectedIndex = index;
            };

            scope.highlightsPath = function (item) {
                var index = scope.getIndex(item);
                scope.hoveredIndex = index;
            };

            scope.addPath = function () {
                scope.imageMapObjects.push(getBlankImageMapObject([]));
                var lastItem = scope.imageMapObjects[scope.imageMapObjects.length - 1];
                scope.selectPath(lastItem);
            };

            scope.removePath = function (item) {
                var index = scope.getIndex(item);
                scope.imageMapObjects.splice(index, 1);
            };

            scope.removeAll = function () {
                scope.imageMapObjects.length = 0;
            };

            scope.recognisePaths = function () {
                var conf = scope.imageMapObjects.length == 0 ||
                    confirm("There are paths already created. Do you want to add more?");
                if (conf) {
                    GuidedImageEditorCanvasService.recognisePaths();
                }
            };

            scope.fieldIsNotEmpty = textFieldIsNotEmpty;

            scope.weightIsValid = weightIsValid;

            scope.saveIsActive = function () {
                return _changed && imageMapObjectsAreValid.call(scope);
            };

            scope.getObjects = function () {
                return scope.imageMapObjects.slice().sort(function (a, b) {
                    if (a.navigationIndex > b.navigationIndex) {
                        return 1;
                    } else if (a.navigationIndex < b.navigationIndex) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            };

            scope.getIndex = function (item) {
                return scope.imageMapObjects.indexOf(item);
            };

            scope.$watch("selectedIndex", function (newVal) {
                var selectedItem = scope.imageMapObjects[newVal];
                if (selectedItem != null) {
                    scope.selectedItem = selectedItem;
                }
            });

            GuidedImageEditorCanvasService.registerOutWatchers(function (coordinates) {
                if (!newCoordinatesEqual(scope, coordinates)) {
                    _changed = true;
                    coordinates.forEach(function (c, i) {
                        var ob = scope.getObjects()[i];
                        if (ob == null) {
                            scope.imageMapObjects.push(getBlankImageMapObject(c));
                        } else {
                            ob.outlineCoordinates = c;
                        }
                    });
                    scope.$apply();
                }
            });

            scope.$watch("imageMapObjects", function (newVal, oldVal) {
                if (newVal != oldVal) {
                    if (oldVal.length > 0) {
                        _changed = true;
                    }
                    if (newVal.length != oldVal.length) {
                        notifyCanvas();
                    }
                }
            }, true);

            function notifyCanvas() {
                var coords = scope.getObjects().map(function (item) {
                    return item.outlineCoordinates;
                });
                GuidedImageEditorCanvasService.updatePathsIn(coords);
            }
        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                selectedIndex: "=?",
                hoveredIndex: "=?",
                imageMapObjects: "=?"
            },
            template: require("./guided-image-editor-path-list.directive.html")
        };
    }

};

function getBlankImageMapObject(coordinates) {
    return {
        id: [],
        weight: 0,
        description: "",
        outlineCoordinates: coordinates
    }
}

function newCoordinatesEqual(scope, coordinates) {
    var oldCoords = scope.imageMapObjects.map(function (i) {
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

function imageMapObjectsAreValid() {
    var scope = this;
    return scope.imageMapObjects.filter(function (item) {
        return weightIsValid(item.weight) &&
            textFieldIsNotEmpty(item.description) &&
            item.outlineCoordinates.length > 0;
    }).length == scope.imageMapObjects.length;
}


