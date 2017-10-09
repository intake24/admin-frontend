/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

var angular = require("angular");

var ObjectRecognition = require("./object-recognition");
var PathDrawer = require("./path-drawer");

module.exports = function (app) {
    require("./guided-image-editor-canvas.service")(app);
    app.directive("guidedImageEditorCanvas", ["$window", "$timeout", "GuidedImageEditorCanvasService", directiveFun]);

    function directiveFun($window, $timeout, GuidedImageEditorCanvasService) {

        function controller(scope, element, attributes) {

            var _timeout,
                _inCoordinates = [],
                _imageLoaded;

            scope.imageScale = 0;

            scope.paths = [];

            scope.canvas = element[0].querySelector("canvas");
            scope.svg = element[0].querySelector("svg");

            angular.element($window).bind("resize", function () {
                $timeout.cancel(_timeout);
                _timeout = $timeout(function () {
                    setCanvasSize.call(scope);
                    refreshPaths.call(scope);
                }, 500);
            });

            scope.notifyServices = function () {
                GuidedImageEditorCanvasService.updatePathsOut(outputPaths.call(scope));
            };

            scope.$watch("src", function (newVal, oldVal) {
                _imageLoaded = false;
                if (newVal && newVal !== oldVal) {
                    setImage.call(scope, function () {
                        _imageLoaded = true;
                        setPathsFromInput.call(scope, _inCoordinates);
                    });
                }
            });

            scope.$watch("hoveredPathIndex", function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.pathDrawer.highlightPath(newVal);
                }
            });

            scope.$watch("selectedPathIndex", function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.pathDrawer.selectPath(newVal);
                }
            });

            GuidedImageEditorCanvasService.registerCanvasWatchers(function () {
                outlineObjects.call(scope);
                scope.notifyServices();
            }, function (coordinates) {
                _inCoordinates = coordinates;
                if (_imageLoaded) {
                    setPathsFromInput.call(scope, _inCoordinates);
                }
            });

        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                src: "=?",
                hoveredPathIndex: "=?",
                selectedPathIndex: "=?",
                active: "=?"
            },
            template: require("./guided-image-editor-canvas.directive.html")
        };
    }

};

function setImage(onLoad) {
    var scope = this;
    this.img = new Image();
    this.img.crossOrigin = "Anonymous";
    this.img.onload = function () {
        setCanvas.call(scope);
        if (onLoad) {
            onLoad();
        }
    };
    this.img.src = this.src;
}

function setCanvas() {
    var scope = this;
    var context = this.canvas.getContext('2d');

    this.canvas.width = this.img.width;
    this.canvas.height = this.img.height;

    setCanvasSize.call(this);

    context.drawImage(this.img, 0, 0, this.img.width, this.img.height);

    this.pathDrawer = new PathDrawer(this.svg, function (paths) {
        scope.paths.length = 0;
        scope.paths.push.apply(scope.paths, getScaledPaths(scope, paths));
        scope.notifyServices();
    }, function (index) {
        scope.selectedPathIndex = index;
        scope.$apply();
    });

    this.getCanvasContext = function () {
        return scope.canvas.getContext('2d');
    }
}

function getScaledPaths(scope, paths) {
    return paths.map(function (p) {
        return p.map(function (c) {
            return [c[0] / scope.imageScale, c[1] / scope.imageScale]
        })
    })
}

function setCanvasSize() {
    var canvasRect = this.canvas.getBoundingClientRect();

    this.imageScale = canvasRect.width / this.img.width;

    this.svg.setAttribute("width", canvasRect.width);
    this.svg.setAttribute("height", canvasRect.height);
}

function outlineObjects() {
    var context = this.getCanvasContext();
    var imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.paths.push.apply(this.paths, ObjectRecognition.recognise(imageData));
    refreshPaths.call(this);
}

function setPathsFromInput(coordinates) {
    var scope = this;
    scope.paths = coordinates.map(function (item) {
        return item.map(function (c) {
            return [c[0] * scope.canvas.width, c[1] * scope.canvas.width]
        });
    });
    refreshPaths.call(scope);
}

function outputPaths() {
    var scope = this;
    return scope.paths.map(function (item) {
        return item.map(function (c) {
            return [c[0] / scope.canvas.width, c[1] / scope.canvas.width]
        });
    });
}

function refreshPaths() {
    if (!this.pathDrawer) {
        return;
    }
    var scale = this.imageScale;
    var paths = this.paths.map(function (p) {
        return p.map(function (n) {
            return [n[0] * scale, n[1] * scale]
        });
    });
    this.pathDrawer.setPaths(paths);
}


