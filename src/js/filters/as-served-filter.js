'use strict';

module.exports = function (app) {
    app.filter('asServedFilter', function () {
        return filterFun;
    });
};

function filterFun(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function (value, key) {
        var actual = ('' + value.description).toLowerCase();
        if (actual.indexOf(expected) !== -1) {
            result[key] = value;
        }
    });
    return result;
}