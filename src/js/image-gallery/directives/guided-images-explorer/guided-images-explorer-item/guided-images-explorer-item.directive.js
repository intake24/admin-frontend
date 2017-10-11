/**
 * Created by Tim Osadchiy on 30/09/2017.
 */

"use strict";

var getFormedUrl = require('../../../../core/utils/get-formed-url');

module.exports = function (app) {
    app.directive("guidedImagesExplorerItem", ["appRoutes", directiveFun]);
};

function directiveFun(appRoutes) {

    function controller(scope, element, attributes) {
        scope.getItemUrl = function () {
            return getFormedUrl(appRoutes.imageGalleryGuidedItem, {guidedId: scope.title});
        };
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