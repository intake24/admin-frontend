'use strict';

module.exports = function (app) {
    app.controller('AuthController', ['$scope', 'UserService', controllerFun]);
};

function controllerFun($scope, UserService) {

    $scope.survey_id = ''; // TODO
    $scope.username = '';
    $scope.password = '';

    $scope.login = function () {
        UserService.login($scope.username, $scope.password).then(function () {
            hideModal();
        }, function () {
            showMessage(gettext('Failed to log you in'), 'danger');
        });
    };

    $scope.logout = function () {
        UserService.logout();
        hideModal();
        showModal('modal-authenticate');
    };

    if (UserService.getAuthenticated()) {
        hideModal();
    } else {
        showModal('modal-authenticate');
    }
}