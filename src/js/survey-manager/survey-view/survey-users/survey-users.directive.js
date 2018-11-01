/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

var userTypes = require("./survey-users-types")();

module.exports = function (app) {
    app.directive("surveyUsers", ["AdminUsersService", "MessageService", "$timeout", directiveFun]);
    require("./survey-respondent-modal/survey-respondent-modal.directive")(app);
    require("./survey-staff-modal/survey-staff-modal.directive")(app);
};

function directiveFun(AdminUsersService, MessageService, $timeout) {

    function controller(scope, element, attribute) {

        scope.userModalIsOpen = false;

        scope.views = {
            staff: new View("Staff"),
            respondents: new View("Respondents")
        };

        scope.searchQuery = "";

        scope.users = [];

        scope.editedUser = null;

        scope.loading = true;
        scope.fileLoading = false;

        scope.authUrlsExporting = false;
        scope.authUrlsDownloadUrl = null;

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

        scope.getUserType = function () {
            return scope.views.staff.active ? userTypes.USER_TYPE_STAFF : userTypes.USER_TYPE_RESPONDENT;
        };

        scope.getUserTitle = function (user) {
            if (scope.views.staff.active) {
                return user.name ? [user.name, user.email].join(", ") : user.email;
            } else {
                return user.name ? [user.name, user.userName].join(", ") : user.userName;
            }
        };

        scope.onUserSaved = function () {
            successMessage(MessageService);
        };

        scope.onUserCreated = function (user) {
            onUsersUpdated(scope, AdminUsersService, MessageService);
        };

        scope.onUserDeleted = function () {
            var i = scope.users.indexOf(scope.editedUser);
            scope.users.splice(i, 1);
            successMessage(MessageService);
        };

        scope.checkExportStatus = function (requestId) {
            AdminUsersService.authUrlsExportStatus(scope.surveyId, requestId)
                .then(function (status) {

                    if (status.Successful) {
                        scope.authUrlsExporting = false;
                        scope.authUrlsDownloadUrl = status.Successful.downloadUrl;

                        $timeout(function() {
                            scope.authUrlsDownloadUrl = null;
                        }, 300000);
                    } else if (status.Failed) {
                        scope.authUrlsExporting = false;
                        MessageService.showMessage("Authentication URLs export failed: " + status.Failed.errorMessage, "danger");
                    } else if (status.Pending) {

                        $timeout(function () {
                            scope.checkExportStatus(requestId);
                        }, 1000);

                    } else {
                        MessageService.showMessage("Unexpected response from the server", "danger");
                    }

                }, function () {
                    scope.authUrlsExporting = false;
                });

        };

        scope.exportAuthUrls = function () {
            scope.authUrlsExporting = true;
            scope.authUrlsDownloadUrl = null;

            AdminUsersService.exportAuthUrls(scope.surveyId)
                .then(function (requestId) {
                        scope.checkExportStatus(requestId);
                    },
                    function () {
                        scope.authUrlsExporting = false;
                    });
        };

        scope.selectView(scope.views.respondents);

        scope.onFilesChange = function (fileList) {
            var file = fileList[0],
                def;
            scope.fileLoading = true;
            if (scope.surveyId == null) {
                return;
            } else if (scope.views.respondents.active) {
                def = AdminUsersService.uploadSurveyRespondentsCsv(scope.surveyId, file);
            }
            def.then(function () {
                    onUsersUpdated(scope, AdminUsersService, MessageService);
                },
                function () {
                    errorMessage()
                }).finally(function () {
                scope.fileLoading = false;
            });
        };

        scope.$watchCollection(function () {
            return [scope.surveyId, scope.views.staff.active, scope.views.respondents.active];
        }, function () {
            getUsers(scope, AdminUsersService);
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

function onUsersUpdated(scope, AdminUsersService, MessageService) {
    getUsers(scope, AdminUsersService);
    successMessage(MessageService);
}

function getUsers(scope, service) {
    if (scope.surveyId == null) {
        return;
    } else if (scope.views.staff.active) {
        scope.loading = true;
        service.listSurveyStaff(scope.surveyId, 0, 999).then(function (data) {
            scope.users = data;
        }).finally(function () {
            scope.loading = false;
        });
    } else if (scope.views.respondents.active) {
        scope.loading = true;
        service.listSurveyRespondents(scope.surveyId, 0, 999).then(function (data) {
            scope.users = data;
        }).finally(function () {
            scope.loading = false;
        });
    }
}

function successMessage(MessageService) {
    MessageService.showMessage("Users list was successfully updated", "success");
}
