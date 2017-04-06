/**
 * Created by Tim Osadchiy on 26/03/2017.
 */

"use strict";

var getFormedUrl = require("../utils/get-formed-url");

module.exports = function (app) {
    app.service("AdminUsersService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    var surveyStaff = $window.api_base_url + "surveys/:surveyId/users/staff",
        surveyRespondents = $window.api_base_url + "surveys/:surveyId/users/respondents";

    function unpackPublicUserData(data) {

        return {
            id: data.id,
            userName: data.aliases[0],
            email: data.email[0],
            name: data.name[0],
            phone: data.phone[0]
        }
    }

    function unpackPublicUserDataList(dataList) {
        return dataList.map(unpackPublicUserData);
    }

    function packUserData(data) {
        return {
            id: data.id,
            aliases: data.userName ? [data.userName] : [],
            name: data.name ? [data.name] : [],
            email: data.email ? [data.email] : [],
            phone: data.phone ? [data.phone] : []
        }
    }

    return {
        listSurveyRespondents: function (surveyId, offset, limit) {
            var url = getFormedUrl(surveyRespondents, {surveyId: surveyId}) +
                "?offset=" + offset +
                "&limit=" + limit;
            return $http.get(getFormedUrl(url)).then(unpackPublicUserDataList);
        },
        listSurveyStaff: function (surveyId, offset, limit) {
            var url = getFormedUrl(surveyStaff, {surveyId: surveyId}) +
                "?offset=" + offset +
                "&limit=" + limit;
            return $http.get(getFormedUrl(url)).then(unpackPublicUserDataList);
        },
        patchSurveyRespondent: function (userReq) {
            var url = getFormedUrl(surveyRespondents, {surveyId: userReq.surveyId});
            var data = {userRecords: [userReq].map(packUserData)};
            return $http.post(url, data);

        },
        patchSurveyStaff: function (userReq) {
            var url = getFormedUrl(surveyStaff, {surveyId: userReq.surveyId});
            var data = {userRecords: [userReq].map(packUserData)};
            return $http.post(url, data);

        }
    };

}
