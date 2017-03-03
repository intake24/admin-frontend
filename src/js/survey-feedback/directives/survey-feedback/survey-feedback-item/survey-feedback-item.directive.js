/**
 * Created by Tim Osadchiy on 16/02/2017.
 */

"use strict";

module.exports = function (app) {

    app.directive("surveyFeedbackItem", ["DemographicGroupsService", directiveFun]);
    require("./survey-feedback-demographic-group/survey-feedback-demographic-group.directive")(app);

};

function directiveFun(DemographicGroupsService) {

    function controller(scope, element, attribute) {

        scope.uiSelect = {
            nutrientType: null
        };

        refreshFields(scope);

        scope.folded = true;
        scope.loading = false;
        scope.onRemoved = scope.onRemoved || function () {
            };

        scope.nutrientRuleTypes = [
            {
                id: "range", name: "Range",
                description: "Feedback is based on the consumption of selected " +
                "nutrient by a participant fitting into the defined ranges."
            },
            {
                id: "energy_divided_by_bmr", name: "Energy / BMR",
                description: "This rule is normally applied to Energy. " +
                "Feedback is based on the Energy consumed by " +
                "a participant divided by BMR fitting into the defined ranges."
            },
            {
                id: "percentage_of_energy", name: "Percentage of energy",
                description: "Feedback is based on the contribution of the selected nutrient " +
                "to Energy consumed by a participant."
            }
        ];

        scope.edit = function () {
            scope.editState = true;
        };

        scope.addDemographicGroup = function () {
            scope.folded = false;
            scope.demographicGroups.unshift({
                id: null,
                sex: null,
                age: null,
                height: null,
                weight: null,
                physicalLevelId: null,
                nutrientTypeId: scope.nutrientTypeId,
                scaleSectors: [],
                editState: true
            });
        };

        scope.cancel = function () {
            scope.editState = false;
            refreshFields(scope);
            if (!scope.nutrientTypeId) {
                scope.onRemoved();
            }
        };

        scope.save = function () {
            if (!formIsValid(scope)) {
                return;
            }
            if (!scope.nutrientTypeId) {
                createNew(scope, DemographicGroupsService);
            } else {
                patchDemographicGroups(scope, DemographicGroupsService);
            }
        };

        scope.saveButtonIsActive = function () {
            return formIsValid(scope);
        };

        scope.toggleFolded = function () {
            scope.folded = !scope.folded;
        };

        scope.onDemographicGroupRemoved = function (item) {
            var i = scope.demographicGroups.indexOf(item);
            scope.demographicGroups.splice(i, 1);
            if (!scope.demographicGroups.length) {
                scope.onRemoved();
            }
        };

        scope.getNutrientKCalPerUnitVisible = function () {
            return scope.newNutrientRuleType == "percentage_of_energy";
        };

        scope.getUnit = function() {

            if (scope.newNutrientRuleType == "percentage_of_energy") {
                return "%";
            } else if (scope.newNutrientRuleType == "energy_divided_by_bmr") {
                return "kcal^2 / day"
            } else {
                return scope.uiSelect.nutrientType ? scope.uiSelect.nutrientType.unit : "";
            }

        };

        scope.$watchCollection("nutrientTypesDictionary", function () {
            selectDefaultNutrient(scope);
        });

        scope.$watchCollection("[newNutrientRuleType, nutrientRuleType]", function () {
            var nutrientRuleType = scope.editState ? scope.newNutrientRuleType : scope.nutrientRuleType;
            var item = scope.nutrientRuleTypes.filter(function (item) {
                return item.id == nutrientRuleType;
            })[0];
            scope.nutrientRuleTypeName = item ? item.name : "";
            scope.nutrientRuleTypeHelp = item ? item.description : "";
        });

    }

    return {
        restrict: "E",
        scope: {
            nutrientTypeId: "=?",
            nutrientRuleType: "=?",
            nutrientTypeKCalPerUnit: "=?",
            demographicGroups: "=?",
            nutrientTypesDictionary: "=?",
            editState: "=?",
            onRemoved: "&"
        },
        link: controller,
        template: require("./survey-feedback-item.direcive.html")
    }

}

function updateScope(scope, data) {
    scope.nutrientTypeId = data.nutrientTypeId;
    scope.nutrientRuleType = data.nutrientRuleType;
    scope.nutrientTypeKCalPerUnit = data.nutrientTypeKCalPerUnit;
}

function refreshFields(scope) {
    scope.newNutrientRuleType = scope.nutrientRuleType;
    scope.newNutrientTypeKCalPerUnit = scope.nutrientTypeKCalPerUnit;
    selectDefaultNutrient(scope);
}

function formIsValid(scope) {
    var checkKCal = scope.getNutrientKCalPerUnitVisible();
    if (checkKCal) {
        try {
            parseFloat(scope.newNutrientTypeKCalPerUnit);
            return scope.uiSelect.nutrientType != null;
        } catch (e) {
            return false;
        }
    } else {
        return scope.uiSelect.nutrientType != null;
    }
}

function getDemographicGroupRequest(scope, demographicGroup) {
    demographicGroup = demographicGroup || {};
    return {
        sex: demographicGroup.sex,
        age: demographicGroup.age,
        height: demographicGroup.height,
        weight: demographicGroup.weight,
        physicalLevelId: demographicGroup.physicalLevelId,
        nutrientTypeId: scope.uiSelect.nutrientType.nutrientId,
        nutrientRuleType: scope.newNutrientRuleType,
        nutrientTypeKCalPerUnit: scope.newNutrientTypeKCalPerUnit,
        scaleSectors: demographicGroup.scaleSectors || []
    };
}

function findAndUpdateDemographicGroup(scope, demographicGroupData) {
    var item = scope.demographicGroups.filter(function (item) {
        return item.id == demographicGroupData.id;
    })[0];
    if (!item) {
        return;
    }
    item.sex = demographicGroupData.sex;
    item.age = demographicGroupData.age;
    item.height = demographicGroupData.height;
    item.weight = demographicGroupData.weight;
    item.physicalLevelId = demographicGroupData.physicalLevelId;
    item.nutrientTypeId = demographicGroupData.nutrientTypeId;
}

function createNew(scope, DemographicGroupsService) {
    var req = getDemographicGroupRequest(scope);
    scope.loading = true;
    DemographicGroupsService.create(req).then(function (data) {
        scope.editState = false;
        scope.folded = false;
        data.editState = true;
        updateScope(scope, data);
        refreshFields(scope);
        scope.demographicGroups.push(data);
    }).finally(function () {
        scope.loading = false;
    });
}

function patchDemographicGroups(scope, DemographicGroupsService) {
    var requestQue = scope.demographicGroups.map(function (item) {
        return {
            id: item.id,
            req: getDemographicGroupRequest(scope, item)
        };
    });
    scope.loading = true;
    executePatchQue(scope, DemographicGroupsService, requestQue);
}

function executePatchQue(scope, DemographicGroupsService, requestQue) {
    var item = requestQue.shift();
    if (!item) {
        scope.loading = false;
        scope.editState = false;
        return;
    }
    DemographicGroupsService.patch(item.id, item.req).then(function (data) {
        updateScope(scope, data);
        refreshFields(scope);
        findAndUpdateDemographicGroup(scope, data);
    }).finally(function () {
        executePatchQue(scope, DemographicGroupsService, requestQue);
    });
}

function selectDefaultNutrient(scope) {
    scope.uiSelect.nutrientType = scope.nutrientTypesDictionary.filter(function (item) {
        return item.nutrientId == scope.nutrientTypeId;
    })[0];
}
