/**
 * Created by Tim Osadchiy on 16/02/2017.
 */

"use strict";

module.exports = function (app) {

    app.directive("surveyFeedbackScaleSector", ["DemographicGroupsService", directiveFun]);

};

function directiveFun(DemographicGroupsService) {

    function controller(scope, element, attribute) {

        scope.formValidation = {};

        scope.folded = true;
        scope.loading = false;

        scope.rangeErrorMessages = [];

        refreshFields(scope);

        scope.sentiments = [
            {id: "too_low", name: "Too low", className: "text-danger"},
            {id: "low", name: "Low", className: "text-danger"},
            {id: "bit_low", name: "A bit low", className: "text-warning"},
            {id: "good", name: "Good", className: "text-success"},
            {id: "excellent", name: "Excellent", className: "text-success"},
            {id: "bit_high", name: "A bit high", className: "text-warning"},
            {id: "high", name: "High", className: "text-danger"},
            {id: "too_high", name: "Too high", className: "text-danger"}
        ];

        scope.toggleFolded = function () {
            scope.folded = !scope.folded;
        };

        scope.getTitle = function () {
            return [
                scope.name,
                [scope.range.start, scope.range.end].join("-") + " " + scope.units,
            ].join(", ");
        };

        scope.edit = function () {
            scope.editState = true;
        };

        scope.save = function () {
            if (!formIsValid(scope)) {
                return;
            }
            var defered;
            scope.loading = true;
            if (!scope.id) {
                defered = DemographicGroupsService.createScaleSector(scope.demographicGroupId, getRequest(scope));
            } else {
                defered = DemographicGroupsService.patchScaleSector(scope.id, getRequest(scope))
            }

            defered.then(function (data) {
                updateScope(scope, data);
                refreshFields(scope);
                scope.editState = false;
            }).finally(function () {
                scope.loading = false;
            });

        };

        scope.remove = function () {
            scope.loading = false;
            DemographicGroupsService.deleteScaleSector(scope.id).then(function () {
                scope.onRemoved();
            });
        };

        scope.cancel = function () {
            scope.editState = false;
            refreshFields(scope);
            if (!scope.id) {
                scope.onRemoved();
            }
        };

        scope.getSentimentClass = function () {
            return scope.sentiments.filter(function (item) {
                return item.id == scope.sentiment;
            }).map(function (item) {
                return item.className;
            })[0];
        };

    }

    return {
        restrict: "E",
        scope: {
            id: "=?",
            demographicGroupId: "=?",
            name: "=?",
            description: "=?",
            sentiment: "=?",
            range: "=?",
            units: "=?",
            editState: "=?",
            scaleSectors: "=?",
            onRemoved: "&"
        },
        link: controller,
        template: require("./survey-feedback-scale-sector.direcive.html")
    }

}

function updateScope(scope, serverData) {
    scope.id = serverData.id;
    scope.name = serverData.name;
    scope.sentiment = serverData.sentiment;
    scope.description = serverData.description;
    scope.newDescription = serverData.description;
    scope.range.start = serverData.range.start;
    scope.range.end = serverData.range.end;
}

function refreshFields(scope) {
    scope.newName = scope.name;
    scope.newSentiment = scope.sentiment;
    scope.newDescription = scope.description;
    scope.newRange = {
        start: scope.range.start,
        end: scope.range.end
    };

    scope.formValidation.nameIsValid = true;
    scope.formValidation.sentimentIsValid = true;
    scope.formValidation.rangeIsValid = true;
    scope.rangeErrorMessages.length = 0;
}

function formIsValid(scope) {
    var valid = true;

    if (!scope.newName || scope.newName.trim() == "") {
        valid = false;
        scope.formValidation.nameIsValid = false;
    }

    if (scope.newSentiment == null) {
        valid = false;
        scope.formValidation.sentimentIsValid = false;
    }

    scope.rangeErrorMessages.length = 0;

    if (scope.newRange.start == null ||
        scope.newRange.end == null ||
        scope.newRange.start < 0 ||
        scope.newRange.end < 0) {
        valid = false;
        scope.formValidation.rangeIsValid = false;
        scope.rangeErrorMessages.push("Range contains positive values only.");
    } else if (scope.newRange.start >= scope.newRange.end) {
        valid = false;
        scope.formValidation.rangeIsValid = false;
        scope.rangeErrorMessages.push("Start of the range must be less than its end.");
    } else {

        var overlappingRanges = scope.scaleSectors.filter(function (item) {
            return item.id != scope.id &&
                item.range.start < scope.newRange.end &&
                scope.newRange.start < item.range.end;
        });

        if (overlappingRanges.length) {
            valid = false;
            scope.formValidation.rangeIsValid = false;
            var message = "Range overlaps with: " + overlappingRanges.map(function (sector) {
                    return [
                        sector.name,
                        [sector.range.start, sector.range.end].join("-"),
                    ].join(", ");
                }).join("; ") + ".";
            scope.rangeErrorMessages.push(message);
        }

    }

    if (scope.newRange.end == null) {
        valid = false;
        scope.formValidation.rangeIsValid = false;
    }

    return valid;
}

function getRequest(scope) {
    return {
        name: scope.newName,
        description: scope.newDescription,
        sentiment: scope.newSentiment,
        range: {
            start: scope.newRange.start,
            end: scope.newRange.end
        }
    }
}