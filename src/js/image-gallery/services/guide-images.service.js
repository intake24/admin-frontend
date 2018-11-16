/**
 * Created by Tim Osadchiy on 28/09/2017.
 */

"use strict";

var angular = require("angular");

module.exports = function (app) {
    app.service("GuideImagesService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    var GUIDE_IMAGE_URL = $window.api_base_url + "admin/portion-size/guide-image";
    var IMAGE_MAP_URL =$window.api_base_url + "admin/portion-size/image-map";


    function uploadImageMapFile(imageMapParams) {
        var fd = new FormData();
        fd.append("baseImage", imageMapParams.baseImage);
        fd.append("imageMapParameters", JSON.stringify({
            id: imageMapParams.id,
            description: imageMapParams.description
        }));
        return $http.post(IMAGE_MAP_URL, fd, {
            transformRequest: angular.identity,
            headers: {"Content-Type": undefined}
        });
    }

    function unpackObject(obj) {
        /**
         * Transform flatten coordinates to [[x,y]]
         */
        var c = [];
        for (var i = 0; i < obj.outlineCoordinates.length; i += 2) {
            c.push([obj.outlineCoordinates[i],
                obj.outlineCoordinates[i + 1]]);
        }
        obj.outlineCoordinates = c;
    }

    function unpackObjects(objs) {
        objs.forEach(unpackObject);
    }

    return {
        list: function () {
            return $http.get(GUIDE_IMAGE_URL);
        },
        post: function (imageMapParams) {
            return uploadImageMapFile(imageMapParams).then(function (imgMapResponse) {
                var req = angular.copy(imgMapResponse);
                req.imageMapId = imgMapResponse.id;
                req.objectWeights = {};
                return $http.post(GUIDE_IMAGE_URL + "/new", req);
            });
        },
        get: function (id) {
            return $http.get(GUIDE_IMAGE_URL + "/" + id).then(function (data) {
                unpackObjects(data.objects);
                return data;
            });
        },
        patchMeta: function (id, guideImageMeta) {
            return $http.patch(GUIDE_IMAGE_URL + "/" + id + "/meta", guideImageMeta);
        },
        patchObjects: function (imageMapId, reqObject) {
            var url = GUIDE_IMAGE_URL + "/" + imageMapId + "/objects";
            var data = angular.copy(reqObject);
            data.objects.forEach(function (d) {
                /***
                 * Flatten coordinates
                 */
                d.outlineCoordinates = d.outlineCoordinates.reduce(function (a, b) {
                    return a.concat(b)
                }, []);
            });
            return $http.patch(url, data).then(function (data) {
                unpackObjects(data);
                return data;
            });
        },
        delete: function (guideImageId) {
            var url = GUIDE_IMAGE_URL + "/" + guideImageId;
            return $http.delete(url);
        }
    }
}