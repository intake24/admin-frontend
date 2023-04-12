"use strict";

module.exports = function (app) {
    app.controller("ImageGalleryDrinkware", ["$scope", function ($scope) {

        $scope.slidingScales = [];

        $scope.onSetImageSelected = function (fileList) {
            $scope.setImageFile = fileList[0];
        }

        $scope.onSetOutlinesSelected = function (fileList) {
            $scope.setOutlinesFile = fileList[0];
        }

        $scope.onVolumeSamplesSelected = function (fileList) {
            $scope.volumeSamplesFile = fileList[0];
        }

        $scope.showFileName = function (file) {
            if (file) return file.name;
            return "(no file selected)"
        }

        $scope.addSlidingScale = function () {
            $scope.slidingScales.push({});
        }

        $scope.removeSlidingScale = function (index) {
            $scope.slidingScales.splice(index, 1);
        }

        $scope.upload = function() {
            window.alert(JSON.stringify($scope.slidingScales));
        }
    }]);
};
