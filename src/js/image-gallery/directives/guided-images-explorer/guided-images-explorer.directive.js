/**
 * Created by Tim Osadchiy on 30/09/2017.
 */

"use strict";

module.exports = function (app) {
    require("./guided-images-explorer-item/guided-images-explorer-item.directive")(app);
    app.directive("guidedImagesExplorer", ["GuideImagesService", "appRoutes", "$location", directiveFun]);
};

function directiveFun(GuideImagesService, appRoutes, $location) {

    function controller(scope, element, attributes) {

        var _items = [];

        scope.searchQuery = getSearchQuery();
        scope.addNewUrl = appRoutes.imageGalleryNewGuidedItem;

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

        scope.$watch("searchQuery", setSearchQuery);

        GuideImagesService.list().then(function (data) {
            _items.push.apply(_items, data);
        });

        function getSearchQuery() {
            return $location.search().q || "";
        }

        function setSearchQuery(val) {
            $location.search({q: val});
        }

    }

    return {
        restrict: "E",
        link: controller,
        scope: {},
        template: require("./guided-images-explorer.directive.html")
    };
}
