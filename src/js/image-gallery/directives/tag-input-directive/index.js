/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('tagInput', [serviceFun]);

    function serviceFun() {

        function controller(scope, element, attributes) {
            var TAG_FINISHED_SYMBOLS = /(;|,)$/g;
            scope.newTag = '';
            scope.$watch('newTag', function () {
                if (scope.newTag.match(TAG_FINISHED_SYMBOLS)) {
                    addNewTag();
                }
            });

            scope.onNewTagKeyUp = function ($event) {
                if (["Enter", "Space"].indexOf($event.code) > -1) {
                    addNewTag();
                }
            };

            scope.removeTag = function($index) {
                scope.tags.splice($index, 1);
            };

            function addNewTag() {
                var tag = scope.newTag.replace(TAG_FINISHED_SYMBOLS, '').replace(/\s+/g, '');
                if (!tag) {
                    return;
                }
                scope.tags.push(tag);
                scope.newTag = '';
            }
        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                tags: '=?',
            },
            templateUrl: 'src/js/image-gallery/directives/tag-input-directive/tag-input-directive.html'
        };
    }

};
