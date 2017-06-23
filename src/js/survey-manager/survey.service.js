/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

var getFormedUrl = require("../core/utils/get-formed-url");

module.exports = function (app) {
    app.service("SurveyService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    var surveysUrl = $window.api_base_url + "surveys",
        surveyUrl = $window.api_base_url + "surveys/:surveyId",
        surveyCsvResults = $window.api_base_url + "surveys/:surveyId/submissions/csv",
        surveyStaff = $window.api_base_url + "surveys/:surveyId/users/staff",
        surveyRespondents = $window.api_base_url + "surveys/:surveyId/users/respondents";

    function unpackServerData(data) {
        return {
            id: data.id,
            state: data.state,
            schemeId: data.schemeId,
            localeId: data.localeId,
            allowGeneratedUsers: data.allowGeneratedUsers,
            externalFollowUpURL: data.externalFollowUpURL[0],
            supportEmail: data.supportEmail,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description[0]
        }
    }

    function packClientData(data) {
        return {
            id: data.id,
            state: data.state,
            schemeId: data.schemeId,
            localeId: data.localeId,
            allowGeneratedUsers: data.allowGeneratedUsers,
            externalFollowUpURL: data.externalFollowUpURL ? [data.externalFollowUpURL] : [],
            supportEmail: data.supportEmail,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description ? [data.description] : [],
        }
    }

    return {
        list: function () {
            return $http.get(surveysUrl).then(function (data) {
                return data.map(unpackServerData);
            });
        },
        get: function (surveyId) {
            return $http.get(getFormedUrl(surveyUrl, {surveyId: surveyId})).then(function (data) {
                return unpackServerData(data);
            });
        },
        create: function (surveyReq) {
            return $http.post(surveysUrl, packClientData(surveyReq)).then(function (data) {
                return unpackServerData(data);
            });
        },
        patch: function (surveyId, surveyReq) {
            return $http.patch(getFormedUrl(surveyUrl, {surveyId: surveyId}), packClientData(surveyReq))
                .then(function (data) {
                    return unpackServerData(data);
                });
        },
        delete: function (surveyId) {
            return $http.delete(getFormedUrl(surveyUrl, {surveyId: surveyId}));
        },
        getCsvResults: function (surveyId, downloadReq) {
            var url = getFormedUrl(surveyCsvResults, {surveyId: surveyId}) +
                "?dateFrom=" + downloadReq.dateFrom +
                "&dateTo=" + downloadReq.dateTo + "&forceBOM=1";

            // Set responseType to arraybuffer to prevent UTF-8 decoding by the browser that removes
            // the BOM (see http://stackoverflow.com/questions/42715966/preserve-utf-8-bom-in-browser-downloads)
            //
            // MS Excel requires BOM to open UTF-8 CSV files correctly.
            return $http.get(getFormedUrl(url), {responseType: "arraybuffer", timeout: 10 * 60 * 1000});
        }
    };

}