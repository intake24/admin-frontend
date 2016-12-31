/**
 * Created by Tim Osadchiy on 20/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.directive("imageGalleryMainItem", ["$timeout", "ImageService", directiveFun]);
};

function directiveFun($timeout, ImageService) {

    function controller(scope, element, attributes) {

        var tagUpdateDelay = 500,
            tagUpdateTimeout;

        scope.select = function () {
            scope.selected = !scope.selected;
        };

        scope.getItemSelected = function () {
            return !scope.loading && scope.selected;
        };

        scope.getItemDeselected = function () {
            return !scope.loading && !scope.selected;
        };

        scope.copyTags = function () {
            if (scope.onTagsCopied) {
                scope.onTagsCopied(scope.tags.slice());
            }
        };

        scope.pasteTags = function () {
            if (scope.copiedTagsNotEmpty()) {
                scope.tags = scope.copiedTags.slice();
            }
        };

        scope.copiedTagsNotEmpty = function () {
            return scope.copiedTags != undefined && scope.copiedTags.length > 0;
        };

        scope.copiedTagsNotSame = function () {
            return !angular.equals(scope.tags, scope.copiedTags);
        };

        scope.removeItem = function () {
            if (!confirm("Are you sure you want to delete this image?")) {
                return;
            }
            scope.loading = true;
            ImageService.remove([scope.id]).then(function () {
                if (scope.onRemoved) {
                    scope.onRemoved(scope.id);
                }
            }).finally(function () {
                scope.loading = false;
            });
        };

        scope.$watchCollection("tags", function (newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            $timeout.cancel(tagUpdateTimeout);
            tagUpdateTimeout = $timeout(function () {
                ImageService.patch(scope.id, scope.tags);
            }, tagUpdateDelay);
        });

    }

    return {
        restrict: "E",
        link: controller,
        scope: {
            id: "=?",
            src: "=?",
            selected: "=?",
            loading: "=?",
            tags: "=?",
            copiedTags: "=?",
            onTagsCopied: "=?",
            onRemoved: "=?"
        },
        template: require("./image-gallery-main-item.pug")
    };
}