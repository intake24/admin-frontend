/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

"use strict";

module.exports = function(app) {
    app.directive("imgLoader", ["$window", directiveFun]);

    function directiveFun($window) {
        function controller(scope, element, attributes) {
            scope.passedSrc = "";
            scope.loaded = false;
            scope.failed = false;
            scope.completedPercentage = 0;
            scope.parentEl = scope.parent ? document.querySelector(scope.parent) : $window;

            scope.$watch("src", function(newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    scope.passedSrc = "";
                    watchScroll();
                }
            });

            watchScroll();

            function loadImageSrc() {
                scope.loaded = false;
                scope.passedSrc = scope.src;

                var img = new Image(),
                    unregisterWatcher;

                img.onload = function() {
                    scope.loaded = true;
                    unregisterWatcher();
                    scope.$apply();
                };

                img.load(scope.src);

                unregisterWatcher = scope.$watch(
                    function() {
                        return img.completedPercentage;
                    },
                    function() {
                        if (isNaN(img.completedPercentage)) {
                            scope.failed = true;
                        } else {
                            scope.completedPercentage = img.completedPercentage;
                        }
                    }
                );
            }

            function watchScroll() {
                var off = function() {
                        angular.element(scope.parentEl).off("scroll", _bindFn);
                    },
                    _bindFn = function() {
                        if (isInViewport(element[0])) {
                            loadImageSrc();
                            off();
                        }
                    };

                scope.$on("$destroy", off);
                angular.element(scope.parentEl).on("scroll", _bindFn);
                _bindFn();
            }
        }

        return {
            restrict: "E",
            link: controller,
            scope: {
                src: "=?",
                parent: "@"
            },
            template: require("./img-loader-directive.html")
        };
    }
};

/*!
 * Determine if an element is in the viewport
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}    elem The element
 * @return {Boolean}      Returns true if element is in the viewport
 */
var isInViewport = function(elem) {
    var distance = elem.getBoundingClientRect();
    return (
        distance.top >= 0 &&
        distance.left >= 0 &&
        distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        distance.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};
