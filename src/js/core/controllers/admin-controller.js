'use strict';

module.exports = function (app) {
    app.controller('AdminController', ["$scope", "UserStateService", "ModalService", "appRoutes",
        controllerFun]);
};

function controllerFun($scope, UserStateService, ModalService, appRoutes) {
    $scope.authUsername = '';
    $scope.authenticated = false;
    $scope.sidebaropen = false;
    $scope.brandHref = appRoutes.foodExplorer.pattern;
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