/**
 * Created by Tim Osadchiy on 10/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.controller('UserManagerAdmins', ["$scope", "UserManagerService", controllerFun]);
};

function controllerFun($scope, UserManagerService) {
    $scope.searchQuery = "";
}