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
        createExportTaskUrl = $window.api_base_url + "surveys/:surveyId/submissions/async/csv",
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
        createExportTask: function (surveyId, downloadReq) {
            var url = getFormedUrl(createExportTaskUrl, {surveyId: surveyId}) +
                "?dateFrom=" + downloadReq.dateFrom +
                "&dateTo=" + downloadReq.dateTo + "&forceBOM=1";

            return $http.get(url);
        }
    };

}