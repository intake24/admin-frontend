/**
 * Created by Tim Osadchiy on 16/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.directive("onScrolledToBottom", ["$window", directiveFun]);

    function directiveFun($window) {

        function controller(scope, element, attributes) {

            var targetElement = element[0].children[0].children[0];

            if (scope.bindToWindow != undefined) {
                angular.element($window).bind("scroll", function () {
                    triggerIfWindowScrolledToBottom(targetElement, $window, scope.onBottom);
                });
            } else {
                targetElement.bind("scroll", function () {
                    triggerIfElementScrolledToBottom(targetElement, scope.onBottom);
                });
            }

        }

        function triggerIfElementScrolledToBottom(element, callback) {
            if (element.scrollTop == (element.scrollHeight - element.offsetHeight)) {
                console.log("Element scrolled");
                callback();
            }
        }

        function triggerIfWindowScrolledToBottom(element, $window, callback) {
            if (($window.pageYOffset + $window.innerHeight) >= element.offsetHeight) {
                console.log("Window scrolled");
                callback();
            }
        }

        return {
            restrict: 'E',
            link: controller,
            transclude: true,
            scope: {
                onBottom: "=?",
                bindToWindow: "=?"
            },
            template: "<ng-transclude></ng-transclude>"
        };
    }
};
