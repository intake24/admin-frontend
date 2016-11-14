/**
 * Created by Tim Osadchiy on 14/11/2016.
 */

"use strict";

var _ = require("underscore");

module.exports = cloneFoodServiceFactory;

function cloneFoodServiceFactory($q, PackerService) {

    function cloneFoodService(code) {
        var self = this,
            deffered = $q.defer(),
            _targetFoodData, _newCode;

        self.getFoodDefinition(code).then(function (targetFoodData) {
            _targetFoodData = targetFoodData;
            var unpacked = PackerService.unpackFoodRecord(targetFoodData);
            unpacked.main.englishDescription = gettext("Copy of") + " " + unpacked.main.englishDescription;
            var newFoodDef = PackerService.packNewFoodRecord(unpacked);

            return self.createNewFoodWithTempCode(newFoodDef);
        }).then(function (newCode) {
            var newLocalData = angular.copy(_targetFoodData.local);
            newLocalData.baseVersion = [];
            newLocalData.associatedFoods = _.map(_targetFoodData.associatedFoods,
                PackerService.stripAssociatedFoodHeader);
            newLocalData.localDescription = newLocalData.localDescription.length == 1 ?
                [gettext("Copy of") + " " + newLocalData.localDescription[0]] : [];
            _newCode = newCode;

            return self.updateFoodLocalRecord(newCode, newLocalData);
        }).then(function () {
            deffered.resolve(_newCode);
        });

        return deffered.promise;
    }

    return cloneFoodService;
}
