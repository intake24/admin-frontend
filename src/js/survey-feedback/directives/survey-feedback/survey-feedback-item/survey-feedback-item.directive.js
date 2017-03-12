/**
 * Created by Tim Osadchiy on 16/02/2017.
 */

"use strict";

module.exports = function (app) {

    app.directive("surveyFeedbackItem", ["$q", "DemographicGroupsService", directiveFun]);
    require("./survey-feedback-demographic-group/survey-feedback-demographic-group.directive")(app);

};

function directiveFun($q, DemographicGroupsService) {

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
            },
            {
                id: "per_unit_of_weight", name: "Per KG of weight",
                description: "Feedback is based on the consumption of selected " +
                "nutrient by a participant per one's KG of weight " +
                "fitting into the defined ranges."
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
            scope.loading = true;
            if (!scope.nutrientTypeId) {
                createNew(scope, DemographicGroupsService, $q).then(function () {
                    scope.folded = false;
                    scope.loading = false;
                    scope.editState = false;
                });
            } else {
                patchDemographicGroups(scope, DemographicGroupsService, $q).then(function () {
                    scope.loading = false;
                    scope.editState = false;
                });
            }
        };

        scope.clone = function () {
            scope.onCloned()
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

        scope.getUnit = function () {

            if (scope.newNutrientRuleType == "percentage_of_energy") {
                return "%";
            } else if (scope.newNutrientRuleType == "energy_divided_by_bmr") {
                return ""
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
            onRemoved: "&",
            onCloned: "&"
        },
        link: controller,
        template: require("./survey-feedback-item.directive.html")
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

function updateDemographicGroup($q, DemographicGroupsService,
                                demographicGroup, demographicGroupData) {
    if (!demographicGroup) {
        return;
    }
    demographicGroup.id = demographicGroupData.id;
    demographicGroup.sex = demographicGroupData.sex;
    demographicGroup.age = demographicGroupData.age;
    demographicGroup.height = demographicGroupData.height;
    demographicGroup.weight = demographicGroupData.weight;
    demographicGroup.physicalLevelId = demographicGroupData.physicalLevelId;
    demographicGroup.nutrientTypeId = demographicGroupData.nutrientTypeId;

    return createScaleSectors($q, DemographicGroupsService, demographicGroup.id,
        demographicGroup.scaleSectors);
}

function createScaleSectors($q, DemographicGroupsService, demographicGroupId, scaleSectors) {
    var requestQue = scaleSectors.filter(function (item) {
        return item.id == null;
    }).map(function (item) {
        return {
            reference: item,
            req: {
                name: item.name,
                description: item.description,
                sentiment: item.sentiment,
                range: {
                    start: item.range.start,
                    end: item.range.end
                }
            }
        };
    });

    return executeCreateScaleSectorsQueue($q, DemographicGroupsService,
        demographicGroupId, requestQue);
}

function executeCreateScaleSectorsQueue($q, DemographicGroupsService, demographicGroupId,
                                        requestQue) {
    var item = requestQue.shift();
    if (!item) {
        return $q.resolve();
    }
    return DemographicGroupsService.createScaleSector(demographicGroupId, item.req)
        .then(function (data) {
            updateScaleSector(item.reference, data);
            return executeCreateScaleSectorsQueue($q, DemographicGroupsService, demographicGroupId,
                requestQue);
        });
}

function updateScaleSector(scaleSector, data) {
    if (!scaleSector) {
        return;
    }
    scaleSector.id = data.id;
    scaleSector.name = data.name;
    scaleSector.description = data.description;
    scaleSector.sentiment = data.sentiment;
    scaleSector.range = {
        start: data.range.start,
        end: data.range.end
    };
}

function createNew(scope, DemographicGroupsService, $q) {
    var req = getDemographicGroupRequest(scope);
    scope.loading = true;
    return DemographicGroupsService.create(req).then(function (data) {
        updateScope(scope, data);
        refreshFields(scope);
        if (!scope.demographicGroups.length) {
            data.editState = true;
            scope.demographicGroups.push(data);
            return $q.resolve();
        } else {
            return patchDemographicGroups(scope, DemographicGroupsService, $q);
        }
    });
}

function patchDemographicGroups(scope, DemographicGroupsService, $q) {
    var requestQue = scope.demographicGroups.map(function (item) {
        return {
            id: item.id,
            reference: item,
            req: getDemographicGroupRequest(scope, item)
        };
    });
    return executePatchQueue(scope, DemographicGroupsService, $q, requestQue);
}

function executePatchQueue(scope, DemographicGroupsService, $q, requestQue) {
    var item = requestQue.shift();
    if (!item) {
        return $q.resolve();
    }
    if (item.id == null) {
        var service = DemographicGroupsService.create(item.req);
    } else {
        var service = DemographicGroupsService.patch(item.id, item.req);
    }
    return service.then(function (data) {
        updateScope(scope, data);
        refreshFields(scope);
        return updateDemographicGroup($q, DemographicGroupsService, item.reference, data);
    }).then(function () {
        return executePatchQueue(scope, DemographicGroupsService, $q, requestQue);
    });
}

function selectDefaultNutrient(scope) {
    scope.uiSelect.nutrientType = scope.nutrientTypesDictionary.filter(function (item) {
        return item.nutrientId == scope.nutrientTypeId;
    })[0];
}
