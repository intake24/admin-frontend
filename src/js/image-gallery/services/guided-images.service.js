/**
 * Created by Tim Osadchiy on 28/09/2017.
 */

"use strict";

module.exports = function (app) {
    app.service("GuidedImagesService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    var BASE_URL = $window.api_base_url + "admin/portion-size/guide-image";

    return {
        all: function () {
            return $http.get(BASE_URL).then(function (data) {
                return data.sort(function (a, b) {
                    if (a.id.toLowerCase() > b.id.toLowerCase()) {
                        return 1;
                    } else if (a.id.toLowerCase() < b.id.toLowerCase()) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            });
        },
        get: function (id) {
            return $http.get(BASE_URL + "/" + id + "/full");
        },
        patchMeta: function (id, guideImageMeta) {
            return $http.patch(BASE_URL + "/" + id + "/meta", guideImageMeta);
        }
    }
}