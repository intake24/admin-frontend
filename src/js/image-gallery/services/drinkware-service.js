"use strict";

var _ = require("underscore");
const angular = require("angular");

module.exports = function (app) {
    app.service("DrinkwareService", ["$http", "$window", function ($http, $window) {

        const BASE_URL = $window.api_base_url + "admin/portion-size/drinkware";

        return {
            upload: function (id, description, setImageFile, setOutlinesFile, volumeSamplesFile, slidingScales) {
                let fd = new FormData();
                fd.append("setId", id);
                fd.append("setDescription", description);
                fd.append("setImageFile", setImageFile);
                fd.append("setOutlinesFile", setOutlinesFile);
                fd.append("volumeSamplesFile", volumeSamplesFile);

                fd.append("scaleCount", slidingScales.length);

                slidingScales.forEach((scale, index) => {
                    fd.append(`scaleObjectId[${index}]`, scale.objectId);
                    fd.append(`scaleImageFile[${index}]`, scale.baseImage);
                    fd.append(`scaleOutlineFile[${index}]`, scale.outline);
                });

                return $http.post(BASE_URL + "/upload", fd, {
                    transformRequest: angular.identity,
                    headers: {"Content-Type": undefined}
                });
            },
        }
    }]);
}
