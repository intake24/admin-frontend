'use strict';

var Cookies = require('js-cookie');

module.exports = function (app) {
    app.service('Problems', ['$http', 'Locales', serviceFun]);
};

function serviceFun($http, locales) {

    return {
        getCategoryProblemsRecursive: function (code, onSuccess, onFailure) {
            return $http.get(api_base_url + 'admin/categories/' + locales.current() + '/' + code + '/recursive-problems');
        },

        getFoodProblems: function (code, onSuccess, onFailure) {
            return $http.get(api_base_url + 'admin/foods/' + locales.current() + '/' + code + '/problems');
        }
    };
}
