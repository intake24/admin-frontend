'use strict';

module.exports = function (app) {
    app.service('UserFoodData', ['$http', 'Locales', serviceFun]);
};

function serviceFun($http, locales) {

    return {
        getFoodData: function (code) {
            return $http.get(api_base_url + 'user/foods/' + locales.current() + '/' + code);
        },

        getFoodDataWithSources: function (code) {
            return $http.get(api_base_url + 'user/foods/' + locales.current() + '/' + code + '/with-sources');
        }
    };

}
