'use strict';

module.exports = function (app) {
    app.directive('jfbFormModel', directiveFun);
};

function directiveFun() {
    return {
        restrict: 'A',
        require: 'form',
        compile: compileFun
    };
}

function compileFun(element, attr) {
    var inputs = element.find('input');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs.eq(i);
        if (input.attr('name')) {
            input.attr('ng-model', attr.jfbFormModel + '.' + input.attr('name'));
        }
    }
}