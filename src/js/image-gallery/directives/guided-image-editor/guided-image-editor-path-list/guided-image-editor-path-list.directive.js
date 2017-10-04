/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("guidedImageEditorPathList", ["GuidedImageEditorCanvasService", directiveFun]);

    function directiveFun(GuidedImageEditorCanvasService) {

        function controller(scope, element, attributes) {
            scope.selectPath = function (index) {
                scope.selectedIndex = index;
            };

            scope.highlightsPath = function (index) {
                scope.hoveredIndex = index;
            };

            scope.addPath = function () {
                scope.imageMapObjects.push(getBlanlImageMapObject([]));
                scope.selectPath(scope.imageMapObjects.length - 1);
            };

            scope.removePath = function (index) {
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

            GuidedImageEditorCanvasService.registerOutWatchers(function (coordinates) {
                coordinates.forEach(function (c, i) {
                    var ob = scope.imageMapObjects[i];
                    if (ob == null) {
                        scope.imageMapObjects.push(getBlanlImageMapObject(c));
                    } else {
                        ob.outlineCoordinates = coordinates;
                    }
                });
            });

            scope.$watch("imageMapObjects", function () {
                notifyCanvas();
            }, true);

            function notifyCanvas() {
                GuidedImageEditorCanvasService.updatePathsIn(scope.imageMapObjects.map(function (item) {
                    return item.outlineCoordinates;
                }));
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

function getBlanlImageMapObject(coordinates) {
    return {
        id: [],
        weight: 0,
        description: "",
        outlineCoordinates: coordinates
    }
}


