'use strict';

module.exports = function (app) {
    app.controller('AdminController', ["$scope", "UserService", controllerFun]);
};

function controllerFun($scope, UserService) {
    $scope.authUsername = '';
    $scope.authenticated = false;
    $scope.sidebaropen = false;
    $scope.sidebarToggle = function () {
        $scope.sidebaropen = !$scope.sidebaropen;
    };
    $scope.goToLogout = function () {
        showModal('modal-logout');
    };

    $scope.$watch(function() {
        return UserService.getAuthenticated();
    }, function() {
        $scope.authUsername = UserService.getUsername();
        $scope.authenticated = UserService.getAuthenticated();
    });

}