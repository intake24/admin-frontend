/**
 * Created by Tim Osadchiy on 16/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.directive("onScrolledToBottom", ["$window", "$timeout", directiveFun]);

    function directiveFun($window, $timeout) {

        function controller(scope, element, attributes) {

            var bindFn;

            scope.$on("$destroy", function () {
                if (scope.bindToWindow != undefined) {
                    angular.element($window).off("scroll", bindFn);
                } else {
                    angular.element(element).off("scroll", bindFn);
                }
            });

            $timeout(init);

            function init() {
                var callback = scope.$eval(attributes.onScrolledToBottom);

                if (attributes.bindToWindow != undefined) {
                    bindFn = function () {
                        triggerIfWindowScrolledToBottom(element[0], $window, callback);
                    };
                    angular.element($window).on("scroll", bindFn);
                } else {
                    bindFn = function () {
                        triggerIfElementScrolledToBottom(element[0], callback);
                    };
                    element.on("scroll", bindFn);
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
            restrict: 'A',
            link: controller
        };
    }
};
