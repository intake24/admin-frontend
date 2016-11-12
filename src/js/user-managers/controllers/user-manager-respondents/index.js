/**
 * Created by Tim Osadchiy on 10/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.controller('UserManagerRespondents', ["$scope", "UserManagerService", "UserManagerDrawerService",
        controllerFun]);
};

function controllerFun($scope, UserManagerService, UserManagerDrawerService) {
    $scope.searchQuery = "";

    $scope.items = [];
    $scope.showDeleted = false;

    $scope.toggleShowDeleted = function() {
        $scope.showDeleted = !$scope.showDeleted;
    };

    $scope.getFilteredItems = function () {
        return $scope.items.filter(function (item) {
            return item.login.toLowerCase().search($scope.searchQuery) > -1 &&
                (!item.deleted || $scope.showDeleted);
        });
    };

    $scope.addItem = function () {
        setDrawerListener();
        UserManagerDrawerService.open();
        UserManagerDrawerService.onSave(function () {
            var newItem = UserManagerDrawerService.getValue();
            UserManagerService.add(newItem.login, newItem.password).then(function (data) {
                $scope.items.push(data);
            });
        });
    };

    $scope.editItem = function (item) {
        setDrawerListener();
        UserManagerDrawerService.setValue(item);
        UserManagerDrawerService.open();
        UserManagerDrawerService.onSave(function () {
            var newItem = UserManagerDrawerService.getValue();
            UserManagerService.edit(item.login, newItem.login, newItem.password).then(function () {
                item.login = newItem.login;
            });
        });
    };

    $scope.removeItem = function (item) {
        if (!confirm("Are you sure you want to delete this user?")) {
            return;
        }
        UserManagerService.remove(item.login).then(function () {
            item.deleted = true;
        });
    };

    $scope.restoreItem = function (item) {
        if (!confirm("Are you sure you want to restore this user?")) {
            return;
        }
        UserManagerService.restore(item.login).then(function () {
            item.deleted = false;
        });
    };

    UserManagerService.allRespondents().then(function (data) {
        $scope.items = data;
    });

    function setDrawerListener() {
        var unregisterWatcher = $scope.$watch(function () {
            return UserManagerDrawerService.getOpen();
        }, function () {
            if (!UserManagerDrawerService.getOpen()) {
                UserManagerDrawerService.offSave();
                unregisterWatcher();
            }
        });
    }

}