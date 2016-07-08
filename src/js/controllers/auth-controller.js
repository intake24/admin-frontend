'use strict';

module.exports = function (app) {
    app.controller('AuthController', ['$scope', 'UserService', 'MessageService', 'ModalService', controllerFun]);
};

function controllerFun($scope, UserService, MessageService, ModalService) {

    $scope.survey_id = ''; // TODO
    $scope.username = '';
    $scope.password = '';
    $scope.modalLogOutVisible = false;
    $scope.modalAuthenticateVisible = false;

    $scope.getBackdropVisibe = function() {
        return $scope.modalLogOutVisible || $scope.modalAuthenticateVisible;
    };

    $scope.login = function () {
        UserService.login($scope.username, $scope.password).then(function () {
            ModalService.hideAll();
        }, function () {
            MessageService.showMessage(gettext('Failed to log you in'), 'danger');
        });
    };

    $scope.logout = function () {
        UserService.logout();
        ModalService.showAuthenticateModal();
    };

    $scope.hideLogoutModal = function() {
        ModalService.hideLogoutModal();
    };

    $scope.$watchCollection(function() {
        return [ModalService.getModalAuthenticateVisible(), ModalService.getModalLogOutVisible()];
    }, function() {
        $scope.modalAuthenticateVisible = ModalService.getModalAuthenticateVisible();
        $scope.modalLogOutVisible = ModalService.getModalLogOutVisible();
        if ($scope.modalAuthenticateVisible || $scope.modalLogOutVisible) {
            document.body.className += " modal-open";
        } else {
            document.body.className = document.body.className.replace("modal-open","");
        }
    });

    if (UserService.getAuthenticated()) {
        ModalService.hideAll();
    } else {
        ModalService.showAuthenticateModal();
    }
}