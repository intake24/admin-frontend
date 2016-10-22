'use strict';

module.exports = function (app) {
    app.filter('serving-image-set-filter', function () {
        return filterFun;
    });
};

function filterFun(inputs, filterValues) {
    var output = [];
    angular.forEach(inputs, function (input) {
        if (filterValues.indexOf(input.id) !== -1)
            output.push(input);
    });
    return output;
}