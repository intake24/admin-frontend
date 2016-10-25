/**
 * Created by Tim Osadchiy on 24/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('fileDropZone', [directiveFun]);

    function directiveFun() {

        function controller(scope, element, attributes) {

            scope.blankIsVisible = false;

            element.bind('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                scope.blankIsVisible = true;
                scope.$apply();
            });

            // Get file data on drop
            element.bind('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
                scope.onDropped({fileList: e.dataTransfer.files});
            });

            element.bind('drop dragleave', function (e) {
                e.stopPropagation();
                e.preventDefault();
                scope.blankIsVisible = false;
                scope.$apply();
            });
        }

        return {
            restrict: 'E',
            link: controller,
            transclude: true,
            scope: {
                onDropped: "&"
            },
            templateUrl: 'src/js/image-gallery/directives/file-drop-zone-directive/file-drop-zone-directive.html'
        };
    }

};
