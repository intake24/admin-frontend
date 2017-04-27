'use strict';

module.exports = function (app) {
    app.controller('AdminController', ["$scope", "$location", "UserStateService", "ModalService", "appRoutes",
        controllerFun]);
};

function controllerFun($scope, $location, UserStateService, ModalService, appRoutes) {
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

    $scope.$watchCollection(function () {
        return [ModalService.getModalIsVisible(), $location.path()];
    }, function (newVal) {
        $scope.bodyIsUnscrollable = ModalService.getModalAuthenticateVisible() ||
            ModalService.getModalLogOutVisible() || $location.path() == appRoutes.foodExplorer;
    });

    $scope.$watch(function () {
        return UserStateService.getUserInfo();
    }, function (newValue) {
        $scope.currentUser = newValue;
    });

}