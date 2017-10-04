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
            return $http.get(BASE_URL + "/" + id + "/full").then(function (data) {
                /**
                 * Transform flatten coordinates back to [[x,y]]
                 */
                data.objects.forEach(function (t) {
                    var c = [];
                    for (var i = 0; i < t.outlineCoordinates.length; i += 2) {
                        c.push([t.outlineCoordinates[i],
                            t.outlineCoordinates[i + 1]]);
                    }
                    t.outlineCoordinates = c;
                });
                return data;
            });
        },
        patchMeta: function (id, guideImageMeta) {
            return $http.patch(BASE_URL + "/" + id + "/meta", guideImageMeta);
        }
    }
}