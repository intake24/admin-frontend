/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

module.exports = function (app) {
    require("./guided-image-editor-canvas/guided-image-editor-canvas.directive")(app);
    require("./guided-image-editor-meta/guided-image-editor-meta.directive")(app);
    require("./guided-image-editor-path-list/guided-image-editor-path-list.directive")(app);
    require("./guided-image-editor-image-select/guided-image-editor-image-select.directive")(app);

    app.directive("guidedImageEditor", ["$routeParams",
        "GuidedImagesService", directiveFun]);

    function directiveFun($routeParams, GuidedImagesService) {

        function controller(scope, element, attributes) {


            scope.generalInfoVisible = true;
            scope.canvasIsActive = !scope.generalInfoVisible;

            scope.guideImage = {
                id: $routeParams.guidedId,
                description: "",
                src: "",
                imageMapId: null,
                imageMapObjects: [],
                hoveredPathIndex: null,
                selectedPathIndex: null,
                newImageFile: null
            };

            scope.getIsLoaded = function () {
                return scope.guideImage.imageMapId != null || scope.isNewItem();
            };

            scope.switchView = function (generalInfoVisible) {
                scope.generalInfoVisible = generalInfoVisible;
                scope.canvasIsActive = !generalInfoVisible;
            };

            scope.isNewItem = function () {
                return scope.guideImage.id == null;
            };

            if (!scope.isNewItem()) {
                GuidedImagesService.get($routeParams.guidedId).then(function (data) {
                    setScopeFromData.call(scope.guideImage, data);
                });
            }

        }

        return {
            restrict: 'E',
            link: controller,
            scope: {},
            template: require("./guided-image-editor.directive.html")
        };
    }

};

function setScopeFromData(data) {
    this.description = data.meta.description;
    this.src = data.path;
    this.imageMapId = data.imageMapId;
    this.imageMapObjects.push.apply(this.imageMapObjects, data.objects);
}


