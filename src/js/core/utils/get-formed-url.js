/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (urlTemp, params) {
    var urlParams = getUrlParams(urlTemp);
    for (var k in params) {
        if (!urlParams.hasOwnProperty(k)) {
            throw urlTemp + " has no param " + k;
        }
        urlTemp = urlTemp.replace(urlParams[k], params[k]);
    }
    return urlTemp;
};

function getUrlParams(urlTemp) {
    var res = {}, params = urlTemp.match(/:(.*?)(\-|\/|$)/g).map(function (st) {
        return st.replace(/\//, "");
    });
    params.forEach(function (p) {
        res[p.replace(/^:/, "")] = p;
    });
    return res;
}