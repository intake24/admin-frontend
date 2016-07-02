'use strict';

module.exports = function (app) {
    app.controller('AdminController', ["$scope", "Locales", controllerFun]);
};

function controllerFun($scope, locales) {
    $scope.sidebaropen = false;
    $scope.sidebarToggle = function () {
        $scope.sidebaropen = !$scope.sidebaropen;
    };
    $scope.goToLogout = function () {
        showModal('modal-logout');
    };
}