"use strict";

module.exports = function (app) {
    app.directive("taskStatus", ["SurveyService", "$interval", "$location",
        function (SurveyService, $interval, $location) {
            return {
                restrict: "E",
                scope: {
                    surveyId: "="
                },
                link: function (scope, element, attr) {

                    scope.progressToPercentage = function (progress) {
                        var result = (progress * 100.0 | 0) + "%";
                        return result;
                    };

                    scope.formatCreatedAt = function (dateStr) {

                        function dateCmp(d1, d2) {
                            return (d1.getUTCDate() == d2.getUTCDate() && d1.getUTCMonth() == d2.getUTCMonth() &&
                            d1.getUTCFullYear() == d2.getUTCFullYear());
                        }

                        var date = new Date(dateStr);
                        var today = new Date();
                        var yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);

                        var timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                        if (dateCmp(date, today))
                            return timeStr;
                        else if (dateCmp(date, yesterday))
                            return "Yesterday at " + timeStr;
                        else
                            return date.toLocaleDateString() + " at " + timeStr;
                    }

                    scope.formatDate = function (dateStr) {
                        var date = new Date(dateStr);
                        return date.toLocaleDateString();
                    }

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

                    scope.$watch(function () {
                        return $location.search()["focusTaskId"]
                    }, function (newValue) {
                        scope.focusTaskId = newValue;
                    });
                },
                template: require("./task-status.directive.html")
            }
        }
    ]);
};