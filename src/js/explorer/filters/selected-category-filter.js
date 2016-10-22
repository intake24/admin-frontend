'use strict';

module.exports = function (app) {
    app.filter('selectedCategoryFilter', function () {
        return filterFun;
    });
};

function filterFun(input, search) {
    var result = {};
    angular.forEach(input, function (value, key) {
        var actual = ('' + value.state).toLowerCase();
        if ((actual.indexOf('add') !== -1) || (actual.indexOf('existing') !== -1)) {
            result[key] = value;
        }
    });
    return result;
}