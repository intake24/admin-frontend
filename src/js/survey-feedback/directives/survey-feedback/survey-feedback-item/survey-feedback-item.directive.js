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

        scope.folded = false;
        scope.loading = false;
        scope.onRemoved = scope.onRemoved || function () {
            };

        scope.uiSelect = {
            nutrientType: null
        };

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

        scope.$watchCollection("nutrientTypesDictionary", function () {
            scope.uiSelect.nutrientType = scope.nutrientTypesDictionary.filter(function (item) {
                return item.nutrientId == scope.nutrientTypeId;
            })[0];
        });

    }

    return {
        restrict: "E",
        scope: {
            nutrientTypeId: "=?",
            demographicGroups: "=?",
            nutrientTypesDictionary: "=?",
            editState: "=?",
            onRemoved: "&"
        },
        link: controller,
        template: require("./survey-feedback-item.direcive.html")
    }

}

function formIsValid(scope) {
    return scope.uiSelect.nutrientType != null;
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
        findAndUpdateDemographicGroup(scope, data);
    }).finally(function () {
        executePatchQue(scope, DemographicGroupsService, requestQue);
    });
}
