/**
 * Created by Tim Osadchiy on 16/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.directive("onScrolledToBottom", ["$window", directiveFun]);

    function directiveFun($window) {

        function controller(scope, element, attributes) {

            var onScrolled = scope.$eval(attributes.onScrolledToBottom);

            angular.element($window).on("scroll", function () {
                triggerIfScrolledToBottom(element, $window, onScrolled);
            });

        }

        function triggerIfScrolledToBottom(element, $window, callback) {
            if (($window.pageYOffset + $window.innerHeight) >= element[0].offsetHeight) {
                callback();
            }
        }

        return {
            restrict: 'A',
            link: controller
        };
    }
};
