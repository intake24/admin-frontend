'use strict';

module.exports = function (app) {
    app.controller('AdminController', ["$scope", "UserStateService", "ModalService", controllerFun]);
};

function controllerFun($scope, UserStateService, ModalService) {
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
        return UserStateService.getAuthenticated();
    }, function() {
        $scope.authUsername = UserStateService.getUsername();
        $scope.authenticated = UserStateService.getAuthenticated();
    });

}