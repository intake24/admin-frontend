'use strict';

module.exports = function (app) {
    app.service('UserFoodData', ['$http', 'Locales', serviceFun]);
};

function serviceFun($http, locales) {

    function authApiCallFuture(method, url) {
        return $http({
            method: method,
            url: api_base_url + url,
            headers: {'X-Auth-Token': Cookies.get('auth-token')}
        }).then(
            function (response) {
                return response.data;
            }
        );
    }

    return {
        getFoodData: function (code) {
            return authApiCallFuture('GET', 'user/foods/' + locales.current() + '/' + code);
        },

        getFoodDataWithSources: function (code) {
            return authApiCallFuture('GET', 'user/foods/' + locales.current() + '/' + code + '/with-sources');
        }
    };

}
