'use strict';

module.exports = function (app) {
    app.controller('AdminController', ["$scope", "UserService", "ModalService", controllerFun]);
};

function controllerFun($scope, UserService, ModalService) {
    $scope.authUsername = '';
    $scope.authenticated = false;
    $scope.sidebaropen = false;
    $scope.sidebarToggle = function () {
        $scope.sidebaropen = !$scope.sidebaropen;
    };
    $scope.goToLogout = function () {
        ModalService.showLogoutModal();
    };

    $scope.$watch(function() {
        return UserService.getAuthenticated();
    }, function() {
        $scope.authUsername = UserService.getUsername();
        $scope.authenticated = UserService.getAuthenticated();
    });

}