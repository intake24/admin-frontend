/**
 * Created by Tim Osadchiy on 01/06/2017.
 */

"use strict";

var d3 = require("d3");

var MainSelector = "guides-drawer",
    MainContainerSelector = MainSelector + "-svg",
    PathGroupSelector = MainSelector + "-path-group",
    LineGroupSelector = MainSelector + "-line-group",
    LineSelector = MainSelector + "-line",
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
        _mainContainer.selectAll("g." + PathGroupSelector)
            .data(_paths)
            .enter()
            .append("g")
            .attr("class", PathGroupSelector)
            .each(_redrawPaths);
    }

    function _redrawPaths(path, pathI) {
        var lines = _drawLines.call(this, path, pathI);
        var onDrag = function () {
            lines.attr("x1", function (v) {
                return v[0].x();
            }).attr("y1", function (v) {
                return v[0].y();
            }).attr("x2", function (v) {
                return v[1].x();
            }).attr("y2", function (v) {
                return v[1].y();
            });
            nodes.attr("cx", function (d) {
                return d.x();
            }).attr("cy", function (d) {
                return d.y();
            });

        };
        var nodes = _drawNodes.call(this, path, pathI, onDrag);
    }

    function _drawNodes(path, pathI, onDrag) {
        var container = d3.select(this);

        container.selectAll("g." + NodeGroupSelector).remove();

        var group = container.append("g").attr("class", NodeGroupSelector)
            .selectAll("circle." + NodeSelector)
            .data(function (d) {
                return d.getNodes();
            })
            .enter();

        var nodes = group.append("circle")
            .attr("class", NodeSelector)
            .style("fill", path.getColor())
            .attr("r", 2)
            .attr("cx", function (d) {
                return d.x();
            })
            .attr("cy", function (d) {
                return d.y();
            });

        group.append("circle")
            .attr("class", InvisibleNodeSelector)
            .style("fill", "transparent")
            .attr("r", 6)
            .attr("cx", function (d) {
                return d.x();
            })
            .attr("cy", function (d) {
                return d.y();
            })
            .call(d3.drag()
                .on("start", _dragstarted)
                .on("drag", function (d) {
                    _dragged.call(this, d, onDrag);
                })
                .on("end", _dragended));

        return nodes;
    }

    function _drawLines(path, pathI) {
        var container = d3.select(this);

        container.selectAll("g." + LineGroupSelector).remove();

        var group = container.append("g")
            .attr("class", LineGroupSelector);

        return group.selectAll("g." + LineSelector)
            .data(function (d) {
                var nodes = d.getNodes();
                var lines = [];
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i + 1] != null) {
                        lines.push([nodes[i], nodes[i + 1]]);
                    } else {
                        lines.push([nodes[i], nodes[0]]);
                    }
                }
                return lines;
            })
            .enter()
            .append("line")
            .attr("class", LineSelector)
            .style("stroke", path.getColor())
            .attr("stroke-width", 1)
            .attr("x1", function (v) {
                return v[0].x();
            })
            .attr("y1", function (v) {
                return v[0].y();
            })
            .attr("x2", function (v) {
                return v[1].x();
            })
            .attr("y2", function (v) {
                return v[1].y();
            });
    }

    function _dragstarted(d) {
        console.log("_dragstarted", d);
    }

    function _dragged(d, onDrag) {
        var x = d3.event.x, y = d3.event.y;
        d3.select(this)
            .attr("cx", x)
            .attr("cy", y);
        d.set(x, y);
        onDrag();
        // _redraw();
    }

    function _dragended(d) {
        console.log("_dragended", d);
    }

    this.addPath = function (coordsArr, color) {
        var nodes = coordsArr.map(function (arr) {
            return new PathNode(arr[0], arr[1]);
        });
        var path = new Path(color, nodes);
        _paths.push(path);
        _redraw();
    };

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

    this.set = function (x, y) {
        _x = x;
        _y = y;
    };

    this.x = function () {
        return _x;
    };

    this.y = function () {
        return _y;
    };
}

module.exports = PathDrawer;