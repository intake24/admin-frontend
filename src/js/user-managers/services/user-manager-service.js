/**
 * Created by Tim Osadchiy on 11/11/2016.
 */

'use strict';

var SAMPLE_ADMINS = [
    {login: "admin1", deleted: false},
    {login: "admin2", deleted: false},
];

var SAMPLE_RESPONDENTS = [
    {login: "resp1", deleted: false},
    {login: "resp2", deleted: false},
];

module.exports = function (app) {
    app.service('UserManagerService', ['$q', '$timeout', serviceFun]);
};

function serviceFun($q, $timeout) {

    return {
        allRespondents: function () {
            var deferred = $q.defer();
            deferred.resolve(SAMPLE_RESPONDENTS);

            return deferred.promise;
        },
        allAdmins: function () {
            var deferred = $q.defer();
            deferred.resolve(SAMPLE_ADMINS);

            return deferred.promise;
        },
        generateBlankItem: function () {
            return {login: "", password: "", deleted: false};
        },
        add: function (login, password) {
            var deferred = $q.defer();
            var newItem = {login: login, deleted: false};
            $timeout(function () {
                deferred.resolve(newItem);
            }, Math.random() * 500);
            return deferred.promise;
        },
        edit: function (login, newLogin, password) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve();
            }, Math.random() * 500);
            return deferred.promise;
        },
        remove: function (login) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve();
            }, Math.random() * 500);
            return deferred.promise;
        },
    }
}
