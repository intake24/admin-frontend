'use strict';

module.exports = function (app) {
    app.controller('AuthController', ['$scope', 'UserStateService', 'UserRequestService', 'ModalService', controllerFun]);
};

function controllerFun($scope, UserStateService, UserRequestService, ModalService) {

    $scope.survey_id = ''; // TODO
    $scope.username = UserStateService.getUsername();
    $scope.password = '';
    $scope.modalLogOutVisible = false;
    $scope.modalAuthenticateVisible = false;

    $scope.getBackdropVisibe = function () {
        return $scope.modalLogOutVisible || $scope.modalAuthenticateVisible;
    };

    $scope.login = function () {
        UserRequestService.login($scope.username, $scope.password).then(function (data) {
            UserStateService.set($scope.username, data.token);
            ModalService.hideAll();
            $scope.password = '';
        });
    };

    $scope.logout = function () {
        UserStateService.logout();
        ModalService.showAuthenticateModal();
    };

    $scope.hideLogoutModal = function () {
        ModalService.hideLogoutModal();
    };

    $scope.$watchCollection(function () {
        return [ModalService.getModalAuthenticateVisible(),
            ModalService.getModalLogOutVisible()];
    }, function () {
        $scope.modalAuthenticateVisible = ModalService.getModalAuthenticateVisible();
        $scope.modalLogOutVisible = ModalService.getModalLogOutVisible();
        if ($scope.modalAuthenticateVisible || $scope.modalLogOutVisible) {
            document.body.className += " modal-open";
        } else {
            document.body.className = document.body.className.replace("modal-open", "");
        }
    });

    $scope.$watch(function () {
        return UserStateService.getAuthenticated();
    }, function () {
        if (UserStateService.getAuthenticated()) {
            ModalService.hideAll();
        } else {
            ModalService.showAuthenticateModal();
        }
    });
}