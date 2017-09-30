/**
 * Created by Tim Osadchiy on 30/09/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("guidedImagesExplorerItem", [directiveFun]);
};

function directiveFun() {

    function controller(scope, element, attributes) {

    }

    return {
        restrict: "E",
        link: controller,
        scope: {
            title: "=?",
            description: "=?",
            path: "=?"
        },
        template: require("./guided-images-explorer-item.directive.html")
    };
}