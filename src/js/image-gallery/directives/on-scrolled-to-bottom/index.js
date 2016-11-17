/**
 * Created by Tim Osadchiy on 16/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.directive("onScrolledToBottom", ["$window", "$timeout", directiveFun]);

    function directiveFun($window, $timeout) {

        function controller(scope, element, attributes) {

            var DELAY = 500,
                timeout,
                onScrolled = scope.$eval(attributes.onScrolledToBottom);

            angular.element($window).on("scroll", function () {
                $timeout.cancel(timeout);
                timeout = $timeout(function () {
                    triggerIfScrolledToBottom(element, $window, onScrolled);
                }, DELAY);
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
