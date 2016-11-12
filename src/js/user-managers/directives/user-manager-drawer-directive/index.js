/**
 * Created by Tim Osadchiy on 29/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive("userMangerDrawer", ["UserManagerDrawerService", directiveFun]);

    function directiveFun(UserManagerDrawerService) {

        function controller(scope, element, attributes) {
            scope.title = "";
            scope.login = "";
            scope.password = "";

            scope.close = function () {
                scope.isOpen = false;
                UserManagerDrawerService.close();
                UserManagerDrawerService.setValue();
            };

            scope.save = function () {
                if (!scope.loginIsValid()) {
                    return;
                }
                UserManagerDrawerService.setValue({
                    login: scope.login,
                    password: scope.password
                });
                UserManagerDrawerService.fireSave();
                scope.close();
            };

            scope.loginIsValid = function validToSave() {
                return scope.login.replace(/\s+/gi, "") != "";
            };

            scope.$watch(function () {
                return UserManagerDrawerService.getOpen();
            }, function () {
                scope.isOpen = UserManagerDrawerService.getOpen();
                if (scope.isOpen) {
                    setFormValues(scope, UserManagerDrawerService.getValue())
                }
            });
        }

        function setFormValues(scope, value) {
            if (!value) {
                scope.title = "New user";
                scope.login = "";
            } else {
                scope.title = "Edit user";
                scope.login = value.login;
            }
        }

        return {
            restrict: "E",
            link: controller,
            scope: {},
            template: require("./user-manager-drawer-directive.html")
        };
    }

};
