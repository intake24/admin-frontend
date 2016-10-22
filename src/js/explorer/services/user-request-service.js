/**
 * Created by Tim Osadchiy on 27/09/2016.
 */

'use strict';

module.exports = function (app) {
    app.service('UserRequestService', ['$http', '$q', serviceFun])
};

function serviceFun($http, $q) {
    return {
        login: function (username, password, survey_id) {
            var defer = $q.defer(),
                url = api_base_url + 'signin',
                data = {survey_id: survey_id || '', username: username, password: password};

            $http.post(url, data).then(function successCallback(data) {
                defer.resolve(data);
            });

            return defer.promise;
        }
    }
}
