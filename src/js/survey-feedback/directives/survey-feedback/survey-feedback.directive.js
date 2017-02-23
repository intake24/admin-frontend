/**
 * Created by Tim Osadchiy on 16/02/2017.
 */

"use strict";

module.exports = function (app) {

    app.directive("surveyFeedback", ["DemographicGroupsService", "NutrientTypes", directiveFun]);
    require("./survey-feedback-item/survey-feedback-item.directive")(app);

};

function directiveFun(DemographicGroupsService, NutrientTypes) {

    function controller(scope, element, attribute) {

        scope.searchQuery = "";
        scope.nutrientTypes = [];
        scope.nutrientTypesDictionary = [];
        scope.demographicGroups = [];
        scope.numberOfCols = 2;
        scope.pageWidthInCols = 12;

        scope.addItem = function () {
            var item = generateNutrientItem();
            item.editState = true;
            scope.demographicGroups.unshift(item);
        };

        scope.removeItem = function (item) {
            var i = scope.demographicGroups.indexOf(item);
            scope.demographicGroups.splice(i, 1);
        };

        scope.getColData = function (colNum) {
            var data = scope.demographicGroups,
                itemsNumInCol = Math.round(data.length / scope.numberOfCols);
            return data.slice(itemsNumInCol * colNum, itemsNumInCol * (colNum + 1))
        };

        scope.getCols = function () {
            return new Array(scope.numberOfCols);
        };

        scope.getColClassNumber = function () {
            return Math.round(scope.pageWidthInCols / scope.numberOfCols);
        };

        DemographicGroupsService.list().then(function (data) {
            scope.demographicGroups = organiseData(data);
        });

        NutrientTypes.list().then(function (data) {
            scope.nutrientTypesDictionary.push.apply(scope.nutrientTypesDictionary, data);
        });

    }

    return {
        restrict: "E",
        scope: {},
        link: controller,
        template: require("./survey-feedback.direcive.html")
    }

}

function organiseData(demographicGroupsData, nutrientTypes) {
    var result = [];
    demographicGroupsData.forEach(function (item, index) {
        if (result.filter(function (r) {
                return item.nutrientTypeId == r.nutrientTypeId;
            })[0]) {
            return;
        }
        var demographicGroups = [];
        demographicGroupsData.forEach(function (subItem) {
            if (subItem.nutrientTypeId == item.nutrientTypeId) {
                demographicGroups.push(subItem);
            }
        });
        result.push(generateNutrientItem(item.nutrientTypeId, demographicGroups));
    });
    return result;
}

function generateNutrientItem(nutrientTypeId, demographicGroups) {
    return {
        nutrientTypeId: nutrientTypeId,
        demographicGroups: demographicGroups || [],
        editState: false
    }
}
