"use strict";


module.exports = function (app) {
    app.controller("ImageGalleryDrinkware", ["$scope", "DrinkwareService", function ($scope, DrinkwareService) {

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

        $scope.canUpload = function () {
            let slidingScalesNotEmpty = $scope.slidingScales.length > 0;
            let slidingScalesValid = $scope.slidingScales.every((item) => item.objectId && item.baseImage && item.outline);

            return !$scope.uploadInProgress && $scope.id && $scope.setImageFile && $scope.setOutlinesFile && $scope.volumeSamplesFile &&
                slidingScalesNotEmpty && slidingScalesValid;
        }

        $scope.upload = function () {
            $scope.uploadInProgress = true;
            DrinkwareService.upload($scope.id, $scope.setImageFile, $scope.setOutlinesFile, $scope.volumeSamplesFile, $scope.slidingScales)
                .then(() => $scope.uploadInProgress = false);
        }
    }]);
};
