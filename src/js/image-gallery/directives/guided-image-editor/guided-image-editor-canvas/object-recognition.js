/**
 * Created by Tim Osadchiy on 29/05/2017.
 */

"use strict";

var Cluster = require('clusterfck');

var ClusteringTreshhold = 95;
var PointCloudDensity = 4; // < 4 becomes too slow
var BlackAndWhiteThreshold = 140;

exports.recognise = recognise;
exports.visionFilter = visionFilter;

function recognise(pixels) {
    // Takes ImageData and returns array of arrays containing objects coordinates

    var borderCoords = getObjectsPointCloud(pixels, BlackAndWhiteThreshold, PointCloudDensity);

    return getClusters(borderCoords).map(function (cluster) {
        var hull = new ConvexHull();
        var coors = cluster.map(function (coor) {
            return {x: coor[0], y: coor[1]};
        });
        hull.compute(coors);
        var indices = hull.getIndices() || [];
        return indices.map(function (i) {
            return cluster[i];
        });
    });

}

function visionFilter(pixels) {
    // Useful to test algorithm vision
    // Converts ImageData to black and white high contrast
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var color = getPixelBWColor(d[i], d[i + 1], d[i + 2], BlackAndWhiteThreshold);
        d[i] = d[i + 1] = d[i + 2] = color;
    }
    return pixels;
}

function getObjectsPointCloud(pixels, threshold, density) {
    // Returns coordinates of pixels that are under Black & White high contrast filter
    // contain black color very likely meaning that is a pixel of an object
    var d = pixels.data;
    var borderCoords = [];
    var matrix = new PixelPointMatrix(pixels, density);
    for (var i = 0; i < d.length; i += 4) {
        var color = getPixelBWColor(d[i], d[i + 1], d[i + 2], threshold);
        if (color == 0) {
            var y = parseInt(i / 4 / pixels.width, 10);
            var x = i / 4 - y * pixels.width;

            if (matrix.getIncluded(x, y)) {
                continue;
            } else {
                matrix.markPoint(x, y);
            }

            borderCoords.push([x, y]);
        }
    }
    return borderCoords;
}

function PixelPointMatrix(pixels, distance) {
    // This class helps to avoid creating too dense point clouds that are slow to process
    // by checking that there are no pixels found (set) within a given distance

    var _matrix = [];
    var _maxX = pixels.width - 1;
    var _maxY = pixels.height - 1;

    this.markPoint = function (x, y) {
        if (_matrix[x] == null) {
            _matrix[x] = [];
        }
        _matrix[x][y] = true;
    };

    this.getIncluded = function (x, y) {
        if (_matrix[x] == null) {
            return false;
        } else {
            var xRange = [x - distance < 0 ? 0 : x - distance, x + distance > _maxX ? _maxX : x + distance];
            var yRange = [y - distance < 0 ? 0 : y - distance, y + distance > _maxY ? _maxY : y + distance];
            for (var i = xRange[0]; i < xRange[1]; i++) {
                for (var j = yRange[0]; j < yRange[1]; j++) {
                    if (_matrix[i] != null && _matrix[i][j]) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

}

function getPixelBWColor(r, g, b, threshold) {
//    Return pixel black or white color
    return (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
}

function getClusters(points) {
    var clusters = Cluster.hcluster(points, Cluster.EUCLIDEAN_DISTANCE, Cluster.AVERAGE_LINKAGE, ClusteringTreshhold);
    return clusters.map(function (cluster) {
        return flattenCluster(cluster);
    });
}

function flattenCluster(cluster) {
    if (cluster.value) {
        return [cluster.value];
    } else {
        var r = [];
        r.push.apply(r, flattenCluster(cluster.left));
        r.push.apply(r, flattenCluster(cluster.right));
        return r;
    }
}

function getAverageColor(x, y, pixels, distance) {
    // Potentially useful in future for clustering based on color of an object
    var d = pixels.data;
    var maxX = pixels.width - 1;
    var maxY = pixels.height - 1;
    var xRange = [x - distance < 0 ? 0 : x - distance, x + distance > maxX ? maxX : x + distance];
    var yRange = [y - distance < 0 ? 0 : y - distance, y + distance > maxY ? maxY : y + distance];
    var r = [];
    var g = [];
    var b = [];
    for (var i = xRange[0]; i < xRange[1]; i++) {
        for (var j = yRange[0]; j < yRange[1]; j++) {
            var pI = (i + j * pixels.width) * 4;
            r.push(d[pI]);
            g.push(d[pI + 1]);
            b.push(d[pI + 2]);
        }
    }
    return [averageColor(r), averageColor(g), averageColor(b)];
}

function averageColor(colorList) {
    return parseInt(colorList.reduce(function (a, b) {
            return a + b;
        }) / colorList.length, 10);
}

function ConvexHullPoint(i, a, d) {
    this.index = i;
    this.angle = a;
    this.distance = d;

    this.compare = function (p) {
        if (this.angle < p.angle)
            return -1;
        else if (this.angle > p.angle)
            return 1;
        else {
            if (this.distance < p.distance)
                return -1;
            else if (this.distance > p.distance)
                return 1;
        }
        return 0;
    }
}

function ConvexHull() {
    this.points = null;
    this.indices = null;

    this.getIndices = function () {
        return this.indices;
    };

    this.clear = function () {
        this.indices = null;
        this.points = null;
    };

    this.ccw = function (p1, p2, p3) {
        return (this.points[p2].x - this.points[p1].x) * (this.points[p3].y - this.points[p1].y) - (this.points[p2].y - this.points[p1].y) * (this.points[p3].x - this.points[p1].x);
    };

    this.angle = function (o, a) {
        return Math.atan((this.points[a].y - this.points[o].y) / (this.points[a].x - this.points[o].x));
    };

    this.distance = function (a, b) {
        return ((this.points[b].x - this.points[a].x) * (this.points[b].x - this.points[a].x) + (this.points[b].y - this.points[a].y) * (this.points[b].y - this.points[a].y));
    };

    this.compute = function (_points) {
        this.indices = null;
        if (_points.length < 3)
            return;
        this.points = _points;

        // Find the lowest point
        var min = 0;
        for (var i = 1; i < this.points.length; i++) {
            if (this.points[i].y == this.points[min].y) {
                if (this.points[i].x < this.points[min].x)
                    min = i;
            }
            else if (this.points[i].y < this.points[min].y)
                min = i;
        }

        // Calculate angle and distance from base
        var al = new Array();
        var ang = 0.0;
        var dist = 0.0;
        for (i = 0; i < this.points.length; i++) {
            if (i == min)
                continue;
            ang = this.angle(min, i);
            if (ang < 0)
                ang += Math.PI;
            dist = this.distance(min, i);
            al.push(new ConvexHullPoint(i, ang, dist));
        }

        al.sort(function (a, b) {
            return a.compare(b);
        });

        // Create stack
        var stack = new Array(this.points.length + 1);
        var j = 2;
        for (i = 0; i < this.points.length; i++) {
            if (i == min)
                continue;
            stack[j] = al[j - 2].index;
            j++;
        }
        stack[0] = stack[this.points.length];
        stack[1] = min;

        var tmp;
        var M = 2;
        for (i = 3; i <= this.points.length; i++) {
            while (this.ccw(stack[M - 1], stack[M], stack[i]) <= 0)
                M--;
            M++;
            tmp = stack[i];
            stack[i] = stack[M];
            stack[M] = tmp;
        }

        this.indices = new Array(M);
        for (i = 0; i < M; i++) {
            this.indices[i] = stack[i + 1];
        }
    }
}
