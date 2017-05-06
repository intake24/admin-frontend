/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('imgLoader', [directiveFun]);

    function directiveFun() {

        function controller(scope, element, attributes) {

            scope.loaded = false;
            scope.$watch("src", function (newVal) {
                if (newVal) {
                    loadImageSrc();
                }
            });

            function loadImageSrc() {
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
                    scope.completedPercentage = img.completedPercentage;
                });
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
