/**
 * Created by Tim Osadchiy on 01/10/2017.
 */

"use strict";

module.exports = function (app) {
    app.service("GuidesDrawerCanvasService", [serviceFun]);
};

function serviceFun() {

    var _recogniseRequestCallback = null;

    return {
        recognisePaths: function () {
            if (_recogniseRequestCallback) {
                _recogniseRequestCallback();
            }
        },
        registerWatcher: function (recogniseRequestCallback) {
            _recogniseRequestCallback = recogniseRequestCallback;
        }

    }
}