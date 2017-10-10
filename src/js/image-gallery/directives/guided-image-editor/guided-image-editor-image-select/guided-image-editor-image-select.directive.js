/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("guidedImageEditorImageSelect", [directiveFun]);

    function directiveFun() {

        function controller(scope, element, attributes) {
            
            var _input = element[0].querySelector("input");
            
            scope.previewSrc = null;
            scope.blankIsActive = false;

            scope.getBackgroundStyle = function () {
                return {"background-image": scope.previewSrc ? ("url('" + scope.previewSrc + "')") : ""};
            };

            element.bind('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                scope.blankIsActive = true;
                scope.$apply();
            });

            // Get file data on drop
            element.bind('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
                scope.file = e.dataTransfer.files[0];
                readFile(e.dataTransfer.files[0]);
            });

            element.bind('drop dragleave', function (e) {
                e.stopPropagation();
                e.preventDefault();
                scope.blankIsActive = false;
                scope.$apply();
            });

            _input.addEventListener("change", function () {
                var fileList = this.files;
                scope.file = fileList[0];
                readFile(fileList[0]);
            }, false);
            
            function readFile(file) {
                var reader = new FileReader();
                if (file) {
                    reader.addEventListener("load", function () {
                        scope.previewSrc = reader.result;
                        scope.$apply();
                    }, false);
                    reader.readAsDataURL(file);
                }
            }

        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                file: "=?"
            },
            template: require("./guided-image-editor-image-select.directive.html")
        };
    }

};


