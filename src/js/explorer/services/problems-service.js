'use strict';

var Cookies = require('js-cookie');

module.exports = function (app) {
    app.service('Problems', ['$http', 'LocalesService', serviceFun]);
};

function serviceFun($http, LocalesService) {

    return {
        getCategoryProblemsRecursive: function (code, onSuccess, onFailure) {
            return $http.get(api_base_url + 'admin/categories/' + LocalesService.current() + '/' + code + '/recursive-problems');
        },

        getFoodProblems: function (code, onSuccess, onFailure) {
            return $http.get(api_base_url + 'admin/foods/' + LocalesService.current() + '/' + code + '/problems');
        }
    };
}
