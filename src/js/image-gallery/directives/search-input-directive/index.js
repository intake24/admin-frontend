/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('searchInput', [directiveFun]);

    function directiveFun() {

        function controller(scope, element, attributes) {
            scope.focused = false;
            scope.getActive = function () {
                return this.ngModel != '' || this.focused;
            };
            scope.setFocused = function () {
                this.focused = true;
            };
            scope.setUnfocused = function () {
                this.focused = false;
            };

        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                ngModel: '=',
            },
            templateUrl: 'src/js/image-gallery/directives/search-input-directive/search-input-directive.html'
        };
    }

};
