/**
 * Created by Tim Osadchiy on 16/02/2017.
 */

"use strict";

module.exports = function (app) {

    app.directive("surveyFeedbackDemographicGroup", ["DemographicGroupsService", directiveFun]);
    require("./survey-feedback-scale-sector/survey-feedback-scale-sector.directive")(app);

};

function directiveFun(DemographicGroupsService) {

    function controller(scope, element, attribute) {

        refreshFields(scope);

        scope.folded = false;
        scope.loading = false;

        scope.sexNames = [
            {name: "Not selected"},
            {id: "f", name: "Females"},
            {id: "m", name: "Males"}
        ];
        scope.onRemoved = scope.onRemoved || function () {
            };

        scope.getTitle = function () {
            var parts = [],
                selectedSex = scope.sexNames.filter(function (item) {
                    return item.id == scope.sex;
                })[0];
            if (selectedSex && selectedSex.id) {
                parts.push(selectedSex.name);
            }
            if (scope.age) {
                parts.push([scope.age.start, scope.age.end].join("-") + " yo");
            }
            return parts.join(", ");
        };
        scope.addScaleSector = function () {
            scope.folded = false;
            scope.scaleSectors.push({
                id: null,
                editState: true,
                name: "",
                description: "",
                sentiment: "neutral",
                range: {
                    start: 0,
                    end: 0
                }
            });
        };

        scope.edit = function () {
            scope.editState = true;
        };

        scope.cancel = function () {
            scope.editState = false;
            refreshFields(scope);
            if (!scope.id) {
                scope.onRemoved();
            }
        };

        scope.save = function () {
            var def;
            scope.loading = true;
            if (scope.id) {
                def = DemographicGroupsService.patch(scope.id, getDemographicGroupRequest(scope));
            } else {
                def = DemographicGroupsService.create(getDemographicGroupRequest(scope));
            }
            def.then(function (data) {
                updateScope(scope, data);
                refreshFields(scope);
                scope.editState = false;
            }).finally(function () {
                scope.loading = false;
            });
        };

        scope.remove = function () {
            scope.loading = true;
            DemographicGroupsService.delete(scope.id).then(function () {
                scope.onRemoved();
            }).finally(function () {
                scope.loading = false;
            });
        };

        scope.toggleFolded = function () {
            scope.folded = !scope.folded;
        };

        scope.formIsValid = function () {
            return scope.newSex || scope.newAge.start && scope.newAge.end;
        };

        scope.onScaleSectorRemoved = function (item) {
            var i = scope.scaleSectors.indexOf(item);
            scope.scaleSectors.splice(i, 1);
        };

    }

    return {
        restrict: "E",
        scope: {
            id: "=?",
            nutrientTypeId: "=?",
            sex: "=?",
            age: "=?",
            height: "=?",
            weight: "=?",
            physicalLevelId: "=?",
            scaleSectors: "=?",
            units: "=?",
            editState: "=?",
            onRemoved: "&"
        },
        link: controller,
        template: require("./survey-feedback-demographic-group.direcive.html")
    }

}

function updateScope(scope, data) {
    scope.sex = data.sex;
    scope.age = data.age;
    scope.height = data.height;
    scope.weight = data.weight;
    scope.physicalLevelId = data.physicalLevelId;
    scope.nutrientTypeId = data.nutrientTypeId;
}

function refreshFields(scope) {
    scope.newSex = scope.sex;
    scope.newAge = {
        start: scope.age ? scope.age.start : null,
        end: scope.age ? scope.age.end : null
    };
}

function getDemographicGroupRequest(scope) {
    return {
        sex: scope.newSex,
        age: scope.newAge.start != null && scope.newAge.end != null ? scope.newAge : null,
        height: scope.height,
        weight: scope.weight,
        physicalLevelId: scope.physicalLevelId,
        nutrientTypeId: scope.nutrientTypeId,
        scaleSectors: scope.scaleSectors
    };
}