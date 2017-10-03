/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

var angular = require("angular");

module.exports = function (app) {
    require("./guided-image-editor-canvas/guided-image-editor-canvas.directive")(app);
    require("./guides-drawer-meta/guided-image-editor-meta.directive")(app);

    app.directive("guidedImageEditor", ["$routeParams",
        "GuidedImagesService", "GuidedImageEditorCanvasService", directiveFun]);

    function directiveFun($routeParams, GuidedImagesService, GuidesDrawerCanvasService) {

        function controller(scope, element, attributes) {

            scope.generalInfoVisible = true;

            scope.imageScale = 0;

            scope.guideImage = {
                id: $routeParams.guidedId,
                description: "",
                src: "",
                guideImageId: "",
                baseImageId: "",
                guideImageDescription: "",
                paths: [],
                hoveredPathIndex: null,
                selectedPathIndex: null
            };

            scope.recognisePaths = function () {
                var conf = scope.guideImage.paths.length == 0 ||
                    confirm("There are paths already created. Do you want to add more?");
                if (conf) {
                    GuidesDrawerCanvasService.recognisePaths();
                }
            };

            scope.selectPath = function (index) {
                scope.guideImage.selectedPathIndex = index;
            };

            scope.highlightsPath = function (index) {
                scope.guideImage.hoveredPathIndex = index;
            };

            scope.addPath = function () {
                scope.guideImage.paths.push([]);
                scope.selectPath(scope.guideImage.paths.length - 1);
                notifyCanvas();
            };

            scope.removePath = function (index) {
                scope.guideImage.paths.splice(index, 1);
                notifyCanvas();
            };

            scope.removeAll = function () {
                scope.guideImage.paths.length = 0;
                notifyCanvas();
            };

            scope.switchView = function (generalInfoVisible) {
                scope.generalInfoVisible = generalInfoVisible;
            };

            scope.saveMeta = function () {

            };

            scope.cancelMeta = function () {

            };

            GuidedImagesService.get($routeParams.guidedId).then(function (data) {
                setScopeFromData.call(scope.guideImage, data);
                notifyCanvas();
            });

            GuidesDrawerCanvasService.registerOutWatchers(function (coordinates) {
                scope.guideImage.paths.length = 0;
                scope.guideImage.paths.push.apply(scope.guideImage.paths, coordinates);
            });

            function notifyCanvas() {
                GuidesDrawerCanvasService.updatePathsIn(scope.guideImage.paths);
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
    var paths = data.objects.map(function (t) {
        var c = [];
        for (var i = 0; i < t.outlineCoordinates.length; i += 2) {
            c.push([t.outlineCoordinates[i],
                t.outlineCoordinates[i + 1]]);
        }
        return c;
    });
    this.description = data.meta.description;
    this.src = data.path;
    this.paths.push.apply(this.paths, paths);
}


