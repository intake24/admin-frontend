/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('imgLoader', ['$window', directiveFun]);

    function directiveFun($window) {

        function controller(scope, element, attributes) {

            scope.passedSrc = "";
            scope.loaded = false;
            scope.failed = false;
            scope.completedPercentage = 0;

            scope.$watch("src", function (newVal, oldVal) {
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

                img.onload = function () {
                    scope.loaded = true;
                    unregisterWatcher();
                    scope.$apply();
                };

                img.load(scope.src);

                unregisterWatcher = scope.$watch(function () {
                    return img.completedPercentage;
                }, function () {
                    if (isNaN(img.completedPercentage)) {
                        scope.failed = true;
                    } else {
                        scope.completedPercentage = img.completedPercentage;
                    }
                });
            }

            function watchScroll() {
                var off = function () {
                        angular.element($window).off("scroll", _bindFn);
                    },
                    _bindFn = function () {
                        if (isElementInViewport(element[0], $window)) {
                            loadImageSrc();
                            off();
                        }
                    };

                scope.$on("$destroy", off);
                angular.element($window).on("scroll", _bindFn);
                _bindFn();
            }

        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                src: "=?"
            },
            template: require("./img-loader-directive.html")
        };
    }

};

function isElementInViewport(el, window) {

    var top = el.offsetTop;
    var height = el.offsetHeight;
    var parEl = el;

    while (parEl.offsetParent) {
        parEl = parEl.offsetParent;
        top += parEl.offsetTop;
    }

    return window.pageYOffset <= (top + height) &&
        top <= (window.pageYOffset + window.innerHeight);
}
