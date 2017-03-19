/**
 * Created by Tim Osadchiy on 16/02/2017.
 */

"use strict";

var getFormedUrl = require("../../core/utils/get-formed-url");

module.exports = function (app) {
    app.service("DemographicGroupsService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    var demographicGroupsUrl = $window.api_base_url + "admin/demographic-groups",
        demographicGroupUrl = $window.api_base_url + "admin/demographic-groups/:id",
        scaleSectorsUrl = $window.api_base_url + "admin/demographic-groups/:id/scale-sectors",
        scaleSectorUrl = $window.api_base_url + "admin/demographic-group-scale-sectors/:id";

    function unpackServerData(data) {
        return {
            id: data.id,
            nutrientTypeId: data.nutrientTypeId,
            nutrientRuleType: data.nutrientRuleType,
            nutrientTypeKCalPerUnit: data.nutrientTypeKCalPerUnit[0],
            sex: data.sex[0],
            age: data.age[0],
            height: data.height[0],
            weight: data.weight[0],
            physicalLevelId: data.physicalLevelId[0],
            scaleSectors: data.scaleSectors.map(unpackServerScaleSector)
        }
    }

    function packClientData(data) {
        return {
            id: data.id,
            nutrientTypeId: data.nutrientTypeId,
            nutrientRuleType: data.nutrientRuleType,
            nutrientTypeKCalPerUnit: data.nutrientTypeKCalPerUnit ? [data.nutrientTypeKCalPerUnit] : [],
            rulesDescription: data.rulesDescription,
            sex: data.sex ? [data.sex] : [],
            age: data.age ? [data.age] : [],
            height: data.height ? [data.height] : [],
            weight: data.weight ? [data.weight] : [],
            physicalLevelId: data.physicalLevelId ? [data.physicalLevelId] : [],
            scaleSectors: data.scaleSectors.map(packServerScaleSector)
        }
    }

    function unpackServerScaleSector(scaleSector) {
        return {
            id: scaleSector.id,
            name: scaleSector.name,
            description: scaleSector.description[0],
            sentiment: scaleSector.sentiment,
            range: scaleSector.range
        };
    }

    function packServerScaleSector(scaleSector) {
        return {
            id: scaleSector.id,
            name: scaleSector.name,
            description: scaleSector.description ? [scaleSector.description] : [],
            sentiment: scaleSector.sentiment,
            range: scaleSector.range
        };
    }

    return {
        list: function () {
            return $http.get(demographicGroupsUrl).then(function (data) {
                return data.map(unpackServerData);
            });
        },
        create: function (demographicGroupReq) {
            return $http.post(demographicGroupsUrl, packClientData(demographicGroupReq)).then(function (data) {
                return unpackServerData(data);
            });
        },
        patch: function (demographicGroupId, demographicGroupReq) {
            var url = getFormedUrl(demographicGroupUrl, {id: demographicGroupId});
            return $http.patch(url, packClientData(demographicGroupReq)).then(function (data) {
                return unpackServerData(data);
            });
        },
        delete: function (demographicGroupId) {
            var url = getFormedUrl(demographicGroupUrl, {id: demographicGroupId});
            return $http.delete(url);
        },
        createScaleSector: function (demographicGroupId, scaleSectorReq) {
            var url = getFormedUrl(scaleSectorsUrl, {id: demographicGroupId});
            return $http.post(url, packServerScaleSector(scaleSectorReq)).then(function (data) {
                return unpackServerScaleSector(data);
            });
        },
        patchScaleSector: function (scaleSectorId, scaleSectorReq) {
            var url = getFormedUrl(scaleSectorUrl, {id: scaleSectorId});
            return $http.patch(url, packServerScaleSector(scaleSectorReq)).then(function (data) {
                return unpackServerScaleSector(data);
            });
        },
        deleteScaleSector: function (scaleSectorId) {
            var url = getFormedUrl(scaleSectorUrl, {id: scaleSectorId});
            return $http.delete(url);
        }
    };

}

