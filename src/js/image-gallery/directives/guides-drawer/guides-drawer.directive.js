/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

var ObjectRecognition = require("./object-recognition");
var d3 = require("d3");

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
        scope.pathDrawer.addPath(clusters[i]);
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

var MainSelector = "guides-drawer",
    MainContainerSelector = MainSelector + "-svg",
    PathGroupSelector = MainSelector + "-path-group",
    PathSelector = MainSelector + "-path",
    NodeGroupSelector = MainSelector + "-node-group",
    NodeSelector = MainSelector + "-node",
    InvisibleNodeSelector = MainSelector + "-invisible-node";

function PathDrawer(element, width, height) {

    var _svg = d3.select(element)
        .append("svg")
        .attr("class", MainContainerSelector)
        .attr("width", width)
        .attr("height", height);

    var _mainContainer = _svg.append("g");
    var _paths = [];
    var _selectedPath = null;

    function _redraw() {
        var pathGroups = _mainContainer.selectAll("g." + PathGroupSelector)
            .data(_paths)
            .enter()
            .append("g")
            .attr("class", "g." + PathGroupSelector)
            .each(_redrawNodes);
    }

    function _redrawNodes(path, pathI) {
        var nodeGroups = d3.select(this).selectAll("g." + NodeGroupSelector)
            .data(function (d) {
                return d.getNodes();
            })
            .enter()
            .append("g")
            .attr("class", NodeGroupSelector)
            .each(function (pathNode, pathNodeI) {
                _drawNode.call(this, pathNode, pathNodeI, path.getColor());
            });
    }

    function _drawNode(pathNode, pathNodeI, color) {
        d3.select(this)
            .append("circle")
            .attr("class", NodeSelector)
            .style("fill", color)
            .attr("r", 2)
            .attr("cx", pathNode.x())
            .attr("cy", pathNode.y())
    }

    this.addPath = function (coordsArr) {
        var nodes = coordsArr.map(function (arr) {
            return new PathNode(arr[0], arr[1]);
        });
        var path = new Path(FillColors[_paths.length % FillColors.length], nodes);
        _paths.push(path);
        _redraw();
    }

}

function Path(color, pathNodes, parentSvgContainer) {
    var _nodes = pathNodes;
    var _color = color;

    this.addNode = function (pathNode) {
        _nodes.push(pathNode);
    };

    this.getNodes = function () {
        return _nodes;
    };

    this.getColor = function () {
        return _color;
    };
}

function PathNode(x, y) {
    var _x = x;
    var _y = y;

    function set(x, y) {
        _x = x;
        _y = y;
    }

    this.x = function () {
        return _x;
    };

    this.y = function () {
        return _y;
    };

    this.clone = function () {
        return new PathNode(_x, _y);
    }
}


