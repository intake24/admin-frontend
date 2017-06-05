/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

var angular = require("angular");

var ObjectRecognition = require("./object-recognition");
var PathDrawer = require("./path-drawer");

module.exports = function (app) {
    app.directive("guidesDrawer", ["$window", "$timeout", directiveFun]);

    function directiveFun($window, $timeout) {

        function controller(scope, element, attributes) {

            var timeout;

            scope.selectedPathIndex = null;

            scope.imageScale = 0;

            scope.paths = [];

            scope.canvas = element[0].querySelector("canvas");
            scope.svg = element[0].querySelector("svg");

            scope.recognisePaths = function () {
                outlineObjects.call(scope);
            };

            scope.selectPath = function (index) {
                this.selectedPathIndex = index;
                this.pathDrawer.selectPath(index);
            };

            scope.highlightsPath = function (index) {
                this.pathDrawer.highlightPath(index);
            };

            scope.addPath = function () {
                scope.paths.push([]);
                refreshPaths.call(this);
            };

            scope.removePath = function (index) {
                scope.paths.splice(index, 1);
                refreshPaths.call(this);
            };

            setImage.call(scope);

            angular.element($window).bind("resize", function () {
                $timeout.cancel(timeout);
                timeout = $timeout(function () {
                    setCanvasSize.call(scope);
                    refreshPaths.call(scope);
                }, 500);
            });

        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                src: "=?"
            },
            template: require("./guides-drawer.directive.html")
        };
    }

};

function setImage() {
    var scope = this;
    this.img = new Image();
    this.img.crossOrigin = "Anonymous";
    this.img.onload = function () {
        setCanvas.call(scope);
        scope.recognisePaths();
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

    this.pathDrawer = new PathDrawer(this.svg, function (coords) {
        console.log(coords);
    }, function (index) {
        scope.selectedPathIndex = index;
        scope.$apply();
    });

    this.getCanvasContext = function () {
        return scope.canvas.getContext('2d');
    }
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

function refreshPaths() {
    var scale = this.imageScale;
    var paths = this.paths.map(function (p) {
        return p.map(function (n) {
            return [n[0] * scale, n[1] * scale]
        });
    });
    this.pathDrawer.setPaths(paths);
}


