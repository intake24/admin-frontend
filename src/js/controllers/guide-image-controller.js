'use strict';

module.exports = function (app) {
    app.controller('GuideImageController', ['$scope', 'FoodDataReader', 'DrawersService', controllerFun]);
};

function controllerFun($scope, foodDataReader, DrawersService) {

    var _resultObj = null;

    var _resultField = null;

    $scope.guideImages = null;

    $scope.$on("intake24.admin.LoggedIn", function (event) {
        reloadGuideImages();
    });

    function reloadGuideImages() {
        foodDataReader.getGuideImages().then(function (guideImages) {
                $scope.guideImages = guideImages;
            },
            $scope.handleError);
    }

    $scope.$on("intake24.admin.food_db.GuideImageDrawerOpened", function (event, resultObj, resultField) {
        _resultObj = resultObj;
        _resultField = resultField;
    });

    $scope.setGuideImage = function (guide_image_id) {
        _resultObj[_resultField] = guide_image_id;
        DrawersService.hideDrawer();
    }
}
