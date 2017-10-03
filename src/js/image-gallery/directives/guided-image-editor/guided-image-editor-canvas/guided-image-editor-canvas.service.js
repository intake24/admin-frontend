/**
 * Created by Tim Osadchiy on 01/10/2017.
 */

"use strict";

module.exports = function (app) {
    app.service("GuidedImageEditorCanvasService", [serviceFun]);
};

function serviceFun() {

    var _recogniseRequestCallback = null,
        _updatePathsInCallback = null,
        _updatePathsOutCallback = null;

    return {
        recognisePaths: function () {
            if (_recogniseRequestCallback) {
                _recogniseRequestCallback();
            }
        },
        updatePathsIn: function (paths) {
            if (_updatePathsInCallback) {
                _updatePathsInCallback(paths)
            }
        },
        updatePathsOut: function (paths) {
            if (_updatePathsOutCallback) {
                _updatePathsOutCallback(paths)
            }
        },
        registerOutWatchers: function (updatePathsOutCallback) {
            _updatePathsOutCallback = updatePathsOutCallback;
        },
        registerCanvasWatchers: function (recogniseRequestCallback, updatePathsInCallback) {
            _recogniseRequestCallback = recogniseRequestCallback;
            _updatePathsInCallback = updatePathsInCallback;
        }

    }
}