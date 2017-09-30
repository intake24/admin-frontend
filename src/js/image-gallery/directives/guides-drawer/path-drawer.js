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
var ActiveNodeRadius = 3;
var InvisibleNodeRadius = 6;
var transitionDuration = 100;

var MainSelector = "guides-drawer",
    PathGroupSelector = MainSelector + "-path-group",
    LineGroupSelector = MainSelector + "-line-group",
    LineSelector = MainSelector + "-line",
    NodeGroupSelector = MainSelector + "-node-group",
    NodeSelector = MainSelector + "-node",
    InvisibleNodeSelector = MainSelector + "-invisible-node";

function PathDrawer(svgElement, onUpdate, onSelected) {

    var self = this;

    var _svg = d3.select(svgElement);

    var _mainContainer = _svg.append("g");
    var _paths = [];
    var _svgPaths = [];
    var _selectedPathIndex = null;
    var _highlightedPathIndex = null;
    var _onUpdate = onUpdate;

    _constructor();

    function _constructor() {
        _setAddNewNodeListener();
    }

    function _setAddNewNodeListener() {
        _svg.on("dblclick", _addNewNode);
    }

    function _addNewNode() {
        var selectedPath = _paths[_selectedPathIndex];
        var selectedSvg = _svgPaths[_selectedPathIndex];
        if (selectedPath != null) {
            var cor = d3.mouse(this);
            selectedPath.addNode(new PathNode(cor[0], cor[1]));
            selectedSvg.redraw();
            _notifyPathUpdates();
        }
    }

    function _redraw() {
        _svgPaths.length = 0;
        _mainContainer.selectAll("g." + PathGroupSelector).remove();

        _mainContainer.selectAll("g." + PathGroupSelector)
            .data(_paths)
            .enter()
            .append("g")
            .attr("class", PathGroupSelector)
            .each(_redrawPath);
        _refreshPaths();
        _notifyPathUpdates();
    }

    function _redrawPath(path, pathI) {
        var container = d3.select(this);
        var svgPath =
            new PathSvg(container, path,
                {color: Color, opacity: UnselectedOpacity},
                _validateBorders, _notifyPathUpdates,
                function () {
                    self.highlightPath(pathI);
                }, function () {
                    self.highlightPath();
                }, function () {
                    self.selectPath(pathI);
                    onSelected(pathI);
                });
        _svgPaths.push(svgPath);
    }

    function _validateBorders(x, y) {
        return x > 0 && x < parseFloat(_svg.attr("width")) &&
            y > 0 && y < parseFloat(_svg.attr("height"));
    }

    function _notifyPathUpdates() {
        _onUpdate(_paths.map(function (path) {
            return path.getNodes().map(function (node) {
                return [node.x(), node.y()];
            })
        }));
    }

    function _refreshPaths() {
        var selectedPathSvg = _svgPaths[_selectedPathIndex];
        var highlightedSvg = _svgPaths[_highlightedPathIndex];
        _svgPaths.forEach(function (s) {
            s.setStyle({opacity: UnselectedOpacity});
            s.disable();
        });
        if (highlightedSvg != null) {
            highlightedSvg.setStyle({opacity: HoveredOpacity});
        }
        if (selectedPathSvg != null) {
            selectedPathSvg.setStyle({opacity: SelectedOpacity});
            selectedPathSvg.disable(false);
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
        _refreshPaths();
    };

    this.highlightPath = function (pathIndex) {
        _highlightedPathIndex = pathIndex;
        _refreshPaths();
    };

    this.refresh = function () {
        _redraw();
    }

}

function Path(pathNodes) {
    var _nodes = pathNodes;

    function _distance(n1, n2) {
        return Math.sqrt(Math.pow((n1.x() - n2.x()), 2) + Math.pow((n1.y() - n2.y()), 2));
    }

    function dot(v1, v2) {
        return v1.x() * v2.x() + v1.y() * v2.y();
    }

    function closestPoint(start, end, pt) {
        var lv = new PathNode(start.x() - end.x(), start.y() - end.y());
        var ptv = new PathNode(pt.x() - end.x(), pt.y() - end.y());

        var len = Math.sqrt(dot(lv, lv));
        var uv = new PathNode(lv.x() / len, lv.y() / len);

        var projlen = dot(ptv, uv);

        if (projlen < 0)
            return end;
        else if (projlen > len)
            return start;
        else
            return new PathNode(uv.x() * projlen + end.x(), uv.y() * projlen + end.y());
    }

    this.addNode = function (pathNode) {
        // Fixme: nodes are added in the wrong places when added in random order. So, they should be probably arranged by x and y.
        var shortestDistance = null;
        var index = 0;

        for (var i = 0; i < _nodes.length; i++) {
            var cp;
            if (_nodes[i + 1] == null) {
                cp = _nodes[i];
            } else {
                cp = closestPoint(_nodes[i], _nodes[i + 1], pathNode);
            }
            var d = _distance(cp, pathNode);
            if (shortestDistance == null || d < shortestDistance) {
                shortestDistance = d;
                index = i + 1;
            }
        }

        _nodes.splice(index, 0, pathNode);
    };

    this.removeNode = function (node) {
        var i = _nodes.indexOf(node);
        _nodes.splice(i, 1);
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

function PathSvg(svgSelection, path, style, bordersValidatorFn,
                 onUpdateFn, mouseOverFn, mouseLeaveFn, clickFn) {

    var _container = svgSelection;
    var _onUpdate = onUpdateFn;
    var _path = path;
    var _disabled = false;
    var _style = {
        color: null,
        opacity: null
    };

    var _lines;
    var _nodes;
    var _invisibleNodes;
    var _validateBordersFn = bordersValidatorFn;
    var _onMouseOver = mouseOverFn;
    var _onMouseLeave = mouseLeaveFn;
    var _onClick = clickFn;

    _constructor();

    this.setStyle = function (style) {
        _setStyle(style);
        _applyStyle();
    };

    this.redraw = function () {
        _refresh();
    };

    this.disable = function (bool) {
        _disabled = bool != null ? bool : true;
    };

    function _constructor() {
        _setStyle(style);
        _refresh();
    }

    function _refresh() {
        _drawLines();
        _drawNodes();
        _refreshPositions();
        _setNodesCoords(_invisibleNodes);
        _applyStyle();
        _setPathAreaMouseEventListeners();
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
            .attr("r", InvisibleNodeRadius)
            .on("dblclick", _removeNode)
            .on("mouseover", _hoverNode)
            .on("mouseout", _hoverNode)
            .call(_dragHandlerFactory());
    }

    function _dragHandlerFactory() {
        return d3.drag()
            .on("start", _dragstarted)
            .on("drag", _dragged)
            .on("end", _dragended);
    }

    function _removeNode(node) {
        d3.event.stopPropagation();
        _path.removeNode(node);
        _refresh();
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
    }

    function _applyStyle() {
        _styleNodes(_nodes);
        _styleLines(_lines);
    }

    function _styleNodes(nodes) {
        nodes
            .transition().duration(transitionDuration)
            .style("fill", _style.color)
            .style("opacity", _style.opacity);
    }

    function _hoverNode(d, index) {
        d3.event.stopPropagation();
        var r;
        if (d3.event.type == "mouseover") {
            r = ActiveNodeRadius;
            _onMouseOver();
        } else {
            r = NodeRadius;
            _onMouseLeave();
        }
        _nodes
            .transition().duration(transitionDuration)
            .attr("r", function (d, i) {
                return index == i ? r : NodeRadius;
            });
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
        if (!_disabled && _validateBordersFn(x, y)) {
            d3.select(this)
                .attr("cx", x)
                .attr("cy", y);
            d.set(x, y);
            _refreshPositions();
        }
    }

    function _dragended(d) {
        if (!_disabled) {
            _onUpdate();
        }
    }

    function _setPathAreaMouseEventListeners() {
        _container
            .on("mouseover", _onMouseOver)
            .on("mouseout", _onMouseLeave)
            .on("click", _onClick);
    }

}

module.exports = PathDrawer;