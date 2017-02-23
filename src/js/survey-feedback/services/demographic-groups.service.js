/**
 * Created by Tim Osadchiy on 16/02/2017.
 */

"use strict";

module.exports = function (app) {
    app.service("DemographicGroupsService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    var demographicGroupsUrl = $window.api_base_url + "admin/demographic-groups",
        demographicGroupUrl = $window.api_base_url + "admin/demographic-groups/:id",
        scaleSectorsUrl = $window.api_base_url + "admin/demographic-groups/:id/scale-sectors",
        scaleSectorUrl = $window.api_base_url + "admin/demographic-group-scale-sectors/:id";

    function getUrlParams(urlTemp) {
        var res = {}, params = urlTemp.match(/:(.*?)(\-|\/|$)/g).map(function (st) {
            return st.replace(/\//, "");
        });
        params.forEach(function (p) {
            res[p.replace(/^:/, "")] = p;
        });
        return res;
    }

    function getFormedUrl(urlTemp, params) {
        var urlParams = getUrlParams(urlTemp);
        for (var k in params) {
            if (!urlParams.hasOwnProperty(k)) {
                throw urlTemp + " has no param " + k;
            }
            urlTemp = urlTemp.replace(urlParams[k], params[k]);
        }
        return urlTemp;
    }

    function unpackServerData(data) {
        return {
            id: data.id,
            nutrientTypeId: data.nutrientTypeId,
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

