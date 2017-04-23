'use strict';

module.exports = function (app) {
    app.controller('AdminController', ["$scope", "UserStateService", "ModalService", "appRoutes",
        controllerFun]);
};

function controllerFun($scope, UserStateService, ModalService, appRoutes) {
    $scope.bodyIsUnscrollable = false;
    $scope.authUsername = '';
    $scope.authenticated = false;
    $scope.sidebaropen = false;
    $scope.brandHref = appRoutes.welcome;
    $scope.sidebarToggle = function () {
        $scope.sidebaropen = !$scope.sidebaropen;
    };
    $scope.goToLogout = function () {
        ModalService.showLogoutModal();
    };

    $scope.$watch(function () {
        return ModalService.getModalIsVisible();
    }, function () {
        $scope.bodyIsUnscrollable = ModalService.getModalAuthenticateVisible() ||
            ModalService.getModalLogOutVisible();
    });

    $scope.$watch(function () {
        return UserStateService.getUserInfo();
    }, function (newValue) {
        $scope.currentUser = newValue;
    });

}