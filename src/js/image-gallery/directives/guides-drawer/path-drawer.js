/**
 * Created by Tim Osadchiy on 01/06/2017.
 */

"use strict";

var d3 = require("d3");

var Color = "#7fff0f";
var UnselectedOpacity = 0.4;
var HoveredOpacity = 0.7;
var SelectedOpacity = 1;
var NodeRadius = 2;
var ActiveNodeRadius = 6;
var transitionDuration = 100;

var MainSelector = "guides-drawer",
    PathGroupSelector = MainSelector + "-path-group",
    LineGroupSelector = MainSelector + "-line-group",
    LineSelector = MainSelector + "-line",
    NodeGroupSelector = MainSelector + "-node-group",
    NodeSelector = MainSelector + "-node",
    InvisibleNodeSelector = MainSelector + "-invisible-node";

function PathDrawer(svgElement, onUpdate) {

    var _svg = d3.select(svgElement);

    var _mainContainer = _svg.append("g");
    var _paths = [];
    var _svgPaths = [];
    var _selectedPathIndex = null;
    var _highlightedPathIndex = null;
    var _onUpdate = onUpdate;

    function _redraw() {
        _svgPaths.length = 0;
        _mainContainer.selectAll("g." + PathGroupSelector).remove();

        _mainContainer.selectAll("g." + PathGroupSelector)
            .data(_paths)
            .enter()
            .append("g")
            .attr("class", PathGroupSelector)
            .each(_redrawPath);
        _notifyPathUpdates();
    }

    function _redrawPath(path, pathI) {
        var container = d3.select(this);
        var svgPath = new PathSvg(container, {color: Color, opacity: UnselectedOpacity}, _notifyPathUpdates);
        _svgPaths.push(svgPath);
    }

    function _notifyPathUpdates() {
        _onUpdate(_paths.map(function (path) {
            return path.getNodes().map(function (node) {
                return [node.x(), node.y()];
            })
        }));
    }

    function _refreshStyles() {
        var selectedPathSvg = _svgPaths[_selectedPathIndex];
        var highlightedSvg = _svgPaths[_highlightedPathIndex];
        _svgPaths.forEach(function (s) {
            s.setStyle({opacity: UnselectedOpacity});
        });
        if (highlightedSvg!=null) {
            highlightedSvg.setStyle({opacity: HoveredOpacity});
        }
        if (selectedPathSvg!=null) {
            selectedPathSvg.setStyle({opacity: SelectedOpacity});
        }
    }

    this.setPaths = function (coordsArr) {
        var pathArr = [].concat(coordsArr);
        _paths.length = 0;
        _paths = pathArr.map(function (p, i) {
            var nodes = p.map(function (arr) {
                return new PathNode(arr[0], arr[1]);
            });
            return new Path(nodes);
        });
        _redraw();
    };

    this.selectPath = function (pathIndex) {
        _selectedPathIndex = pathIndex;
        _refreshStyles();
    };

    this.highlightPath = function (pathIndex) {
        _highlightedPathIndex = pathIndex;
        _refreshStyles();
    };

    this.refresh = function () {
        _redraw();
    }

}

function Path(pathNodes) {
    var _nodes = pathNodes;

    this.addNode = function (pathNode) {
        _nodes.push(pathNode);
    };

    this.getNodes = function () {
        return _nodes;
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

function PathSvg(svgSelection, style, onUpdateFn) {

    var _container = svgSelection;
    var _onUpdate = onUpdateFn;
    var _style = {
        color: null,
        opacity: null
    };

    var _lines;
    var _nodes;
    var _invisibleNodes;

    constructor();

    this.setStyle = _setStyle;

    function constructor() {
        _drawLines();
        _drawNodes();
        _refreshPositions();
        _setNodesCoords(_invisibleNodes);
        _setStyle(style);
    }

    function _drawNodes() {

        _container.selectAll("g." + NodeGroupSelector).remove();

        var group = _container.append("g").attr("class", NodeGroupSelector)
            .selectAll("circle." + NodeSelector)
            .data(function (d) {
                return d.getNodes();
            })
            .enter();

        _nodes = group.append("circle")
            .attr("class", NodeSelector)
            .attr("r", NodeRadius);

        _invisibleNodes = group.append("circle")
            .attr("class", InvisibleNodeSelector)
            .style("fill", "transparent")
            .attr("r", ActiveNodeRadius)
            .call(d3.drag()
                .on("start", _dragstarted)
                .on("drag", function (d) {
                    _dragged.call(this, d);
                    _refreshPositions();
                })
                .on("end", function (d) {
                    _dragended.call(this, d);
                    _onUpdate();
                }));
    }

    function _drawLines() {
        _container.selectAll("g." + LineGroupSelector).remove();

        var group = _container.append("g")
            .attr("class", LineGroupSelector);

        _lines = group.selectAll("g." + LineSelector)
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
            .attr("stroke-width", 1);
    }

    function _refreshPositions() {
        _setLinesCoords(_lines);
        _setNodesCoords(_nodes);
    }

    function _setLinesCoords(lines) {
        lines.attr("x1", function (v) {
            return v[0].x();
        }).attr("y1", function (v) {
            return v[0].y();
        }).attr("x2", function (v) {
            return v[1].x();
        }).attr("y2", function (v) {
            return v[1].y();
        });
    }

    function _setStyle(style) {
        for (var i in _style) {
            if (style.hasOwnProperty(i)) {
                _style[i] = style[i];
            }
        }
        _refreshStyle();
    }

    function _refreshStyle() {
        _styleNodes(_nodes);
        _styleLines(_lines);
    }

    function _styleNodes(nodes) {
        nodes
            .transition().duration(transitionDuration)
            .style("fill", _style.color)
            .style("opacity", _style.opacity);
    }

    function _styleLines(lines) {
        lines
            .transition().duration(transitionDuration)
            .style("stroke", _style.color)
            .style("stroke-opacity", _style.opacity)
    }

    function _setNodesCoords(nodes) {
        nodes.attr("cx", function (d) {
            return d.x();
        }).attr("cy", function (d) {
            return d.y();
        });
    }

    function _dragstarted(d) {
        console.log("_dragstarted", d);
    }

    function _dragged(d) {
        var x = d3.event.x, y = d3.event.y;
        d3.select(this)
            .attr("cx", x)
            .attr("cy", y);
        d.set(x, y);
    }

    function _dragended(d) {

    }

}

module.exports = PathDrawer;