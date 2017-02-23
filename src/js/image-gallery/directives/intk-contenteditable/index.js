/**
 * Created by Tim Osadchiy on 03/11/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('intkContenteditable', ['$sce', directiveFun]);

    function directiveFun($sce) {

        function controller(scope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function () {
                element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                read(); // initialize
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function () {
                scope.$evalAsync(read);
            });

            // Write data to the model
            function read() {
                var html = element.text();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html === '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }

        return {
            restrict: 'A',
            require: '?ngModel',
            link: controller
        };
    }

};
