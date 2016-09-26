'use strict';

module.exports = function(app) {
    app.filter('ngTextCutFilter', filterFun);
};

function filterFun () {
    var filter = function (text, length) {
        if (text == undefined || length == undefined) {
            return text;
        }
        return text.length > length ? text.slice(0, length).replace(/\s+$/, '') + '...' : text;
    };
    return filter;
}