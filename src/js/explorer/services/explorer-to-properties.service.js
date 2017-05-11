/**
 * Created by Tim Osadchiy on 11/05/2017.
 */

"use strict";

module.exports = function (app) {
    app.service('ExplorerToProperties', [serviceFun]);
};

function serviceFun() {

    var showLocalDescription = true;

    return {
        getShowLocalDescription: function () {
            return showLocalDescription;
        },
        setShowLocalDescription: function (val) {
            showLocalDescription = val;
        }
    };

}
