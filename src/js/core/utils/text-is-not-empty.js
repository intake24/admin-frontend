/**
 * Created by Tim Osadchiy on 07/10/2017.
 */

"use strict";

module.exports = function () {
    var vals = [].slice.call(arguments);
    return vals.filter(function (item) {
        return item != null && item.trim() !== "";
    }).length === vals.length;
};