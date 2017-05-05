'use strict';

module.exports = function (app) {
    app.controller('AdminController', ["$scope", "$route", "UserStateService", "ModalService", "appRoutes",
        controllerFun]);
};

function controllerFun($scope, $route, UserStateService, ModalService, appRoutes) {
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
        return [ModalService.getModalIsVisible(), getRouteOriginalPath($route)];
    }, function (newVal) {
        $scope.bodyIsUnscrollable = ModalService.getModalAuthenticateVisible() ||
            ModalService.getModalLogOutVisible() || getRouteOriginalPath($route) == appRoutes.foodExplorer;
    });

    $scope.$watch(function () {
        return UserStateService.getUserInfo();
    }, function (newValue) {
        $scope.currentUser = newValue;
    });

    function getRouteOriginalPath($route) {
        return $route.current ? $route.current.$$route.originalPath : "";
    }

}