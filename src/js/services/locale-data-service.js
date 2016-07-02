'use strict';

var Cookies = require('js-cookie');

module.exports = function (app) {
    app.service('LocaleData', ['$http', serviceFun]);
};

function serviceFun($http) {

    function authApiCall(method, url, onSuccess, onFailure) {
        $http({
            method: method,
            url: api_base_url + url,
            headers: {'X-Auth-Token': Cookies.get('auth-token')}
        }).then(
            function (response) {
                onSuccess(response.data);
            },
            function (response) {
                onFailure(response);
            }
        );
    }

    return {
        getAllLocales: function (onSuccess, onFailure) {
            authApiCall('GET', 'admin/locales', onSuccess, onFailure);
        }
    };

}
