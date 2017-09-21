'use strict';

module.exports = function (app) {
    app.controller('PasswordResetController', ["$scope", "$route", "UserStateService", "ModalService", "appRoutes",
        controllerFun]);
};

function controllerFun($scope, $route, UserStateService, ModalService, appRoutes) {
 // kotak
}