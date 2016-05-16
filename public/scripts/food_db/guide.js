angular.module('intake24.admin.food_db').controller('GuideImageController', ['$scope', 'FoodDataReader', 'Drawers', function ($scope, foodDataReader, drawers) {

	var _resultObj = null;

	var _resultField = null;

	$scope.guideImages = null;

	$scope.$on("intake24.admin.LoggedIn", function(event) {
		reloadGuideImages();
	});

	function reloadGuideImages() {
		foodDataReader.getGuideImages().then(function(guideImages) {
			$scope.guideImages = guideImages;
		},
		$scope.handleError);
	}

	$scope.$on("intake24.admin.food_db.GuideImageDrawerOpened", function(event, resultObj, resultField) {
		_resultObj = resultObj;
		_resultField = resultField;
	});

	$scope.setGuideImage = function(guide_image_id) {
		_resultObj[_resultField] = guide_image_id;
		drawers.hideDrawer();
	}
}]);
