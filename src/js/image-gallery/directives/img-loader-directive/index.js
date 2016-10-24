/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('imgLoader', [directiveFun]);

    function directiveFun() {

        function controller(scope, element, attributes) {
            element.addClass('img-loader');
            var img = new Image();
            img.onload = function() {
                scope.loaded = true;
                scope.$apply();
            };
            img.load(scope.src);
            scope.$watch(function() {
                return img.completedPercentage;
            }, function() {
                scope.completedPercentage = img.completedPercentage;
            });
        }

        return {
            restrict: 'A',
            link: controller,
            scope: {
                src: '=?',
            },
            templateUrl: 'src/js/image-gallery/directives/img-loader-directive/img-loader-directive.html'
        };
    }

};
