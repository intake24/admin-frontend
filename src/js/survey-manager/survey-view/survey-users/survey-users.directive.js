/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

var userTypes = require("./survey-users-types")();

module.exports = function (app) {
    app.directive("surveyUsers", ["AdminUsersService", directiveFun]);
    require("./survey-user-modal/survey-user-modal.directive")(app);
};

function directiveFun(AdminUsersService) {

    function controller(scope, element, attribute) {

        scope.userModalIsOpen = false;

        scope.views = {
            staff: new View("Staff"),
            respondents: new View("Respondents")
        };

        scope.searchQuery = "";

        scope.users = [];

        scope.userTypes = userTypes;

        scope.editedUser = null;

        scope.loading = false;
        scope.fileLoading = false;

        scope.newUser = function () {
            scope.editedUser = null;
            scope.userModalIsOpen = true;
        };

        scope.selectView = function (view) {
            for (var i in scope.views) {
                if (scope.views.hasOwnProperty(i)) {
                    scope.views[i].active = false;
                }
            }
            view.active = true;
        };

        scope.editUser = function (user) {
            scope.editedUser = user;
            scope.userModalIsOpen = true;
        };

        scope.onUserSaved = function () {
            console.log(scope.editedUser);
        };

        scope.selectView(scope.views.respondents);

        scope.onFilesChange = function (fileList) {
            var file = fileList[0],
                def;
            scope.fileLoading = true;
            if (scope.surveyId == null) {
                return;
            } else if (scope.views.staff.active) {
                def = AdminUsersService.uploadSurveyStaffCsv(scope.surveyId, file);
            } else if (scope.views.respondents.active) {
                def = AdminUsersService.uploadSurveyRespondentsCsv(scope.surveyId, file);
            }
            def.finally(function () {
                scope.fileLoading = false;
            });
        };

        scope.$watchCollection(function () {
            return [scope.surveyId, scope.views.staff.active, scope.views.respondents.active];
        }, function (newVal) {
            if (scope.surveyId == null) {
                return;
            } else if (scope.views.staff.active) {
                scope.loading = true;
                AdminUsersService.listSurveyStaff(scope.surveyId, 0, 999).then(function (data) {
                    scope.users = data;
                }).finally(function () {
                    scope.loading = false;
                });
            } else if (scope.views.respondents.active) {
                scope.loading = true;
                AdminUsersService.listSurveyRespondents(scope.surveyId, 0, 999).then(function (data) {
                    scope.users = data;
                }).finally(function () {
                    scope.loading = false;
                });
            }
        }, true);

    }

    return {
        restrict: "E",
        scope: {
            surveyId: "=?",
        },
        link: controller,
        template: require("./survey-users.directive.html")
    }

}

function View(name) {
    this.name = name;
    this.active = false;
}
