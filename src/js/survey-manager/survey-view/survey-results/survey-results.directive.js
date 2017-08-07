/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

module.exports = function (app) {
    app.directive("surveyResults", ["SurveyService", "uiDatetimePickerConfig", "$interval", directiveFun]);
    require("./survey-data-export-status/survey-data-export-status.directive")(app);
};

function directiveFun(SurveyService, uiDatetimePickerConfig, $interval) {

    function controller(scope, element, attribute) {

        function formatDate(date) {
            function pad(number) {
                if (number < 10) {
                    return '0' + number;
                }
                return number;
            }

            return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
        }


        function triggerDownload(url, fileName) {
            var anchor = element[0].querySelector("#downloadContainer");
            anchor.setAttribute("href", url);
            anchor.setAttribute("download", fileName);
            anchor.click();
        }

        // A very fragile fallback method in case createObjectURL is not available.
        // Data URL max length is undefined (but seems to be rather large in older IEs
        // that don't support createObjectURL), so worth a try.

        // If support for old IEs turns out to be REALLY needed, consider
        // https://gist.github.com/snekse/8483503431b50b87db5c
        function downloadUsingDataURL(data, fileName) {
            triggerDownload("data:text/csv;charset=UTF-8," + data, fileName);
        }

        // Preferred newer method to download dynamic data as files
        function downloadUsingObjectURL(data, fileName) {
            var blob = new Blob([data], {type: "text/csv;charset=UTF-8"});
            var objectUrl = window.URL.createObjectURL(blob);

            triggerDownload(objectUrl, fileName);
        }

        scope.dateFrom = null;
        scope.dateTo = null;

        scope.uiDatetimePickerConfig = uiDatetimePickerConfig;

        scope.loading = false;

        scope.formValidation = {
            queryPeriod: true
        };

        scope.datePickerState = {
            fromIsOpen: false,
            toIsOpen: false
        };

        scope.openDateFromPicker = function () {
            scope.datePickerState.fromIsOpen = true;
        };

        scope.openDateToPicker = function () {
            scope.datePickerState.toIsOpen = true;
        };

        scope.download = function () {
            if (!validateForm(scope)) {
                return;
            }
            scope.loading = true;

            $interval(function() { scope.loading = false}, 500, 1);

            var fileName = "intake24-" + scope.survey.id + "-data-" +
                formatDate(scope.dateFrom) + "-to-" + formatDate(scope.dateTo) + ".csv";

            SurveyService.createExportTask(scope.survey.id, getRequest(scope));



            /*SurveyService.getCsvResults(scope.survey.id, getRequest(scope))
                .then(function (data) {

                    if (window.URL && window.URL.createObjectURL) {
                        downloadUsingObjectURL(data, fileName);
                    }
                    else {
                        // TODO: needs logging server-side to estimate the number of users who run into this
                        console.warn("createObjectURL is not available, falling back to data URL -- this is fragile!");
                        downloadUsingDataURL(data, fileName);
                    }
                })
                .finally(function () {
                    scope.loading = false;
                });*/
        };

        scope.$watch("survey", function (newVal) {
            updateScope(scope, newVal);
        });

    }

    return {
        restrict: "E",
        scope: {
            survey: "=?"
        },
        link: controller,
        template: require("./survey-results.directive.html")
    }

}

function getRequest(scope) {
    return {
        dateFrom: scope.dateFrom.toISOString(),
        dateTo: scope.dateTo.toISOString()
    };
}

function validateForm(scope) {

    scope.formValidation.queryPeriod = scope.dateFrom != null &&
        scope.dateTo != null &&
        scope.dateTo >= scope.dateFrom;

    return scope.formValidation.queryPeriod;

}

function updateScope(scope, data) {
    if (!data) {
        return;
    }
    scope.dateFrom = new Date(data.startDate);
    scope.dateTo = new Date(data.endDate);
}
