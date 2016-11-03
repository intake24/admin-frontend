/**
 * Created by Tim Osadchiy on 01/11/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('editable', [directiveFun]);

    function directiveFun() {

        function controller(scope, element, attributes) {

            scope.focused = false;
            scope.placeholder = "" || attributes.placeholder

            scope.getPlaceholderIsVisible = function () {
                return scope.ngModel.replace(/\s+/gi, "") == "" && !scope.focused;
            };

            scope.setFocused = function () {
                scope.focused = true;
            };

            scope.setBlured = function () {
                scope.focused = false;
            };

            scope.focus = function() {
                element[0].querySelector('[contenteditable]').focus();
            };

        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                ngModel: '=',
            },
            templateUrl: 'src/js/image-gallery/directives/editable-directive/editable-directive.html'
        };
    }

};