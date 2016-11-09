/**
 * Created by Tim Osadchiy on 24/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('fileButton', [directiveFun]);

    function directiveFun() {

        function controller(scope, element, attributes) {
            var $input = element.find('input')[0],
                $button = element.find('button');

            $input.onchange = function() {
                scope.onChange({fileList: $input.files});
                scope.$apply();
            };

            $button.bind("click", function (e) {
                $input.click();
            });
        }

        return {
            restrict: 'E',
            link: controller,
            transclude: true,
            scope: {
                onChange: "&"
            },
            template: require("./file-button-directive.html")
        };
    }

};
