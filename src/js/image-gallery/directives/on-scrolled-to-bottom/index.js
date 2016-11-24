/**
 * Created by Tim Osadchiy on 16/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.directive("onScrolledToBottom", ["$window", directiveFun]);

    function directiveFun($window) {

        function controller(scope, element, attributes) {

            var targetElement = element[0].children[0].children[0],
                bindFn;

            scope.$on("$destroy", function () {
                if (scope.bindToWindow != undefined) {
                    angular.element($window).off("scroll", bindFn);
                } else {
                    angular.element(targetElement).off("scroll", bindFn);
                }
            });

            init();

            function init() {
                if (scope.bindToWindow != undefined) {
                    bindFn = function () {
                        triggerIfWindowScrolledToBottom(targetElement, $window, scope.onBottom);
                    };
                    angular.element($window).on("scroll", bindFn);
                } else {
                    bindFn = function () {
                        triggerIfElementScrolledToBottom(targetElement, scope.onBottom);
                    };
                    angular.element(targetElement).on("scroll", bindFn);
                }
            }

            function triggerIfElementScrolledToBottom(element, callback) {
                if (element.scrollTop == (element.scrollHeight - element.offsetHeight)) {
                    callback();
                }
            }

            function triggerIfWindowScrolledToBottom(element, $window, callback) {
                if (($window.pageYOffset + $window.innerHeight) >= element.offsetHeight) {
                    callback();
                }
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
