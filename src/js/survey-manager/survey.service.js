/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

var getFormedUrl = require("../core/utils/get-formed-url");

module.exports = function (app) {
    app.service("SurveyService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    var surveyUrl = $window.api_base_url + "surveys";

    function unpackServerData(data) {
        return {
            id: data.id,
            schemeId: data.schemeId,
            localeId: data.localeId,
            allowGeneratedUsers: data.allowGeneratedUsers,
            externalFollowUpURL: data.externalFollowUpURL[0],
            supportEmail: data.supportEmail
        }
    }

    function packClientData(data) {
        return {
            id: data.id,
            schemeId: data.schemeId,
            localeId: data.localeId,
            allowGeneratedUsers: data.allowGeneratedUsers,
            externalFollowUpURL: data.externalFollowUpURL ? [data.externalFollowUpURL] : [],
            supportEmail: data.supportEmail
        }
    }

    return {
        list: function () {
            return $http.get(surveyUrl).then(function (data) {
                return data.map(unpackServerData);
            });
        },
        create: function (surveyReq) {
            return $http.post(surveyUrl, packClientData(surveyReq)).then(function (data) {
                return unpackServerData(data);
            });
        }
    };

}