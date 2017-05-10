/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.service("ImageService", ["$http", "$httpParamSerializerJQLike", "$q", "$window",
        "HttpRequestInterceptor",
        serviceFun]);
};

function serviceFun($http, $httpParamSerializerJQLike, $q, $window, HttpRequestInterceptor) {

    function uploadFile(url, file) {
        var fd = new FormData();
        fd.append("file", file);
        return $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {"Content-Type": undefined}
        });
    }

    return {
        query: function (offset, limit, search) {
            var url = $window.api_base_url + "admin/images/source",
                params = {offset: offset, limit: limit};
            if (search) {
                params.search = search;
            }
            return $http.get(url + "?" + $httpParamSerializerJQLike(params))
        },
        add: function (file) {
            var url = $window.api_base_url + "admin/images/source/new";
            return uploadFile(url, file);
        },
        addForAsServed: function (asServedSetId, file) {
            var url = $window.api_base_url + "admin/images/source/new-as-served?setId=" + asServedSetId;
            return uploadFile(url, file);
        },
        patch: function (id, tags) {
            var url = $window.api_base_url + "admin/images/source/" + id;
            return $http.patch(url, {keywords: tags});
        },
        remove: function (ids) {
            var url = $window.api_base_url + "admin/images/source/delete";
            return $http({
                method: "DELETE",
                url: url,
                data: ids,
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            });
        }
    }
}
