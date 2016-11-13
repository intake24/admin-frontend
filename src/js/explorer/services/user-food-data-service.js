'use strict';

module.exports = function (app) {
    app.service('UserFoodData', ['$http', 'LocalesService', serviceFun]);
};

function serviceFun($http, LocalesService) {

    return {
        getFoodData: function (code) {
            return $http.get(api_base_url + 'user/foods/' + LocalesService.current() + '/' + code);
        },

        getFoodDataWithSources: function (code) {
            return $http.get(api_base_url + 'user/foods/' + LocalesService.current() + '/' + code + '/with-sources');
        }
    };

}
