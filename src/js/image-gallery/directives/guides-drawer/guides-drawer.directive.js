/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

var ObjectRecognition = require("./object-recognition");
var PathDrawer = require("./path-drawer");

var FillColors = [
    "#f44336",
    "#3f51b5",
    "#00bcd4",
    "#4caf50",
    "#ff9800",
    "#ffe500",
    "#673ab7",
    "#795548",
    "#009688",
    "#e91e63"
];

module.exports = function (app) {
    app.directive("guidesDrawer", [directiveFun]);

    function directiveFun() {

        function controller(scope, element, attributes) {

            setImage(scope, element[0].childNodes[0]);

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

function setImage(scope, element) {
    scope.img = new Image();
    scope.img.crossOrigin = "Anonymous";
    scope.img.onload = function () {
        setCanvas(scope, element);
        var context = scope.getCanvasContext();
        var imageData = context.getImageData(0, 0, scope.canvas.width, scope.canvas.height);

        outlineObjects(scope, imageData);

    };
    scope.img.src = scope.src;
}

function setCanvas(scope, element) {
    scope.canvas = element.querySelector("canvas");
    var context = scope.canvas.getContext('2d');
    scope.canvas.width = scope.img.width;
    scope.canvas.height = scope.img.height;
    context.drawImage(scope.img, 0, 0, scope.img.width, scope.img.height);

    scope.pathDrawer = new PathDrawer(element, scope.img.width, scope.img.height);

    scope.getCanvasContext = function () {
        return scope.canvas.getContext('2d');
    }
}

function outlineObjects(scope, imageData) {

    var context = scope.getCanvasContext();

    // var newImageData = applyFilter(imageData, BlackAndWhiteThreshold);

    var clusters = ObjectRecognition.recognise(imageData);

    for (var i = 0; i < clusters.length; i++) {
        scope.pathDrawer.addPath(clusters[i], FillColors[i % FillColors.length]);
        // var pointCloud = clusters[i];
        //
        // context.beginPath();
        // context.moveTo(pointCloud[0][0], pointCloud[0][1]);
        // for (var j = 0; j < pointCloud.length; j++) {
        //     context.lineTo(pointCloud[j][0], pointCloud[j][1]);
        // }
        // context.closePath();
        // context.strokeStyle = FillColors[i];
        // context.stroke();
        // for (var j = 0; j < pointCloud.length; j++) {
        //     dot(context, pointCloud[j], FillColors[i % FillColors.length]);
        // }
    }

}

function dot(ctx, point, style) {
    ctx.save();
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.arc(point[0], point[1], 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}


