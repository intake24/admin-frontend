/**
 * Created by Tim Osadchiy on 30/09/2017.
 */

"use strict";

module.exports = function (app) {
    require("./guided-images-explorer-item/guided-images-explorer-item.directive")(app);
    app.directive("guidedImagesExplorer", ["GuidedImagesService", directiveFun]);
};

function directiveFun(GuidedImagesService) {

    function controller(scope, element, attributes) {

        var _items = [];

        scope.searchQuery = "";

        scope.itemIsFiltered = function (item) {
            return [item.id, item.description].join(" ")
                .match(new RegExp(scope.searchQuery, "gi"));
        };

        scope.getItems = function () {
            return _items.filter(function (item) {
                return [item.id, item.description].join(" ")
                    .match(new RegExp(scope.searchQuery, "gi"));
            })
        };

        scope.onFilesChange = function (fileList) {
            console.log(fileList);
        };

        GuidedImagesService.all().then(function (data) {
            _items.push.apply(_items, data);
        });
    }

    return {
        restrict: "E",
        link: controller,
        scope: {},
        template: require("./guided-images-explorer.directive.html")
    };
}
