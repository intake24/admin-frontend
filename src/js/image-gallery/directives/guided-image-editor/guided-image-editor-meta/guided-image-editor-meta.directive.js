/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

var textFieldIsNotEmpty = require("../../../../core/utils/text-is-not-empty");

module.exports = function (app) {
    app.directive("guidedImageEditorMeta", ["$route",
        "GuidedImagesService", directiveFun]);

    function directiveFun($route, GuidedImagesService) {

        function controller(scope, element, attributes) {

            scope.loading = false;

            scope.editState = false;

            scope.edit = function () {
                scope.editState = true
            };

            scope.cancel = function () {
                refresh.call(scope);
                scope.editState = false;
            };

            scope.fieldIsValid = function (fieldValue) {
                return textFieldIsNotEmpty(fieldValue);
            };

            scope.formIsValid = function () {
                return textFieldIsNotEmpty(scope.newId) &&
                    textFieldIsNotEmpty(scope.newId, scope.newDescription);
            };

            scope.save = function () {
                if (!scope.formIsValid()) {
                    return;
                }
                scope.loading = true;
                var prom;
                if (scope.guideImageId) {
                    prom = GuidedImagesService
                        .patchMeta(scope.guideImageId, {id: scope.newId, description: scope.newDescription})
                        .then(function (data) {
                            $route.updateParams({guidedId: data.id});
                        });
                } else {
                    prom = GuidedImagesService.post({
                        id: scope.newId,
                        description: scope.newDescription,
                        baseImage: scope.imageFile
                    }).then(function (data) {
                        console.log(data);
                    });
                }
                prom.finally(function () {
                    scope.loading = false;
                });
            };

            scope.$watch("[guideImageId,guideImageDescription]", function () {
                refresh.call(scope);
            });

            scope.$watch("imageFile", function () {
                scope.editState = true;
            });
        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                guideImageId: "=?",
                guideImageDescription: "=?",
                imageFile: "=?"
            },
            template: require("./guided-image-editor-meta.directive.html")
        };
    }

};

function refresh() {
    this.newId = this.guideImageId;
    this.newDescription = this.guideImageDescription;
    this.editState = this.guideImageId == null;
}


