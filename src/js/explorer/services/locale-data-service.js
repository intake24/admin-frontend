'use strict';

module.exports = function (app) {
    app.service('LocaleData', ['$http', serviceFun]);
};

function serviceFun($http) {

    return {
        getAllLocales: function (onSuccess, onFailure) {
            $http.get(api_base_url + 'admin/locales').then(onSuccess, onFailure);
        }
    };

}
