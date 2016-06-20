angular.module('intake24.admin').controller('AdminController', ["$scope", "Locales", function($scope, locales) {
    $scope.sidebaropen = false;
    $scope.sidebarToggle = function() {
        $scope.sidebaropen=!$scope.sidebaropen;
    };
    $scope.goToLogout = function() {
        showModal('modal-logout');
    };
}]);
