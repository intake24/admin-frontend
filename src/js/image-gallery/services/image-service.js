/**
 * Created by Tim Osadchiy on 23/10/2016.
 */

'use strict';

var sendImageFile = require("./send-image-file");

module.exports = function (app) {
    app.service("ImageService", ["$http", "$httpParamSerializerJQLike", "$q", "$timeout", "HttpRequestInterceptor",
        serviceFun]);
};

function serviceFun($http, $httpParamSerializerJQLike, $q, $timeout, HttpRequestInterceptor) {

    return {
        query: function (offset, limit, search) {
            var url = "http://api-test.intake24.co.uk/admin/images/source",
                params = {offset: offset, limit: limit};
            if (search) {
                params.search = search;
            }
            return $http.get(url + "?" + $httpParamSerializerJQLike(params))
        },
        add: function (file) {
            var url = "http://api-test.intake24.co.uk/admin/images/source/new";
            return sendImageFile(url, file, HttpRequestInterceptor, $q);
        },
        addForAsServed: function (asServedSetId, file) {
            var url = "http://api-test.intake24.co.uk/admin/images/source/new-as-served?setId=" + asServedSetId;
            return sendImageFile(url, file, HttpRequestInterceptor, $q);
        },
        patch: function (id, tags) {
            var url = "http://api-test.intake24.co.uk/admin/images/source/" + id;
            return $http.patch(url, {keywords: tags});
        },
        remove: function (ids) {
            var url = "http://api-test.intake24.co.uk/admin/images/source/delete";
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
