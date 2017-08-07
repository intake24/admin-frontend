"use strict";

module.exports = function (app) {
    app.directive("surveyDataExportStatus", ["SurveyService", "$interval",
        function (SurveyService, $interval) {
            return {
                restrict: "E",
                scope: {
                    surveyId: "="
                },
                link: function (scope, element, attr) {

                    scope.progressToPercentage = function(progress) {
                        var result = (progress * 100.0 | 0) + "%";
                        console.log(result);
                        return result;
                    };

                    function refreshTasks() {
                        SurveyService.getActiveExportTasks(scope.surveyId).then(
                            function success(response) {
                                scope.activeTasks = response.activeTasks;
                            },
                            function error(response) {
                                console.error(response);
                                // show error to user
                            }
                        )
                    }

                    refreshTasks();

                    var timerId = $interval(function () {
                        refreshTasks();
                    }, 1000);

                    element.on('$destroy', function () {
                        $interval.cancel(timerId);
                    });
                },
                template: require("./survey-data-export-status.directive.html")
            }
        }
    ]);
};