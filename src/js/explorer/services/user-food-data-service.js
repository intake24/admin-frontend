'use strict';

module.exports = function (app) {
    app.service('UserFoodData', ['$http', 'LocalesService', serviceFun]);
};

function serviceFun($http, LocalesService) {

    return {
        getFoodData: function (locale, code) {
            return $http.get(api_base_url + 'user/foods/' + locale + '/' + code);
        },

        getFoodDataWithSources: function (locale, code) {
            return $http.get(api_base_url + 'user/foods/' + locale + '/' + code + '/with-sources');
        }
    };

}
