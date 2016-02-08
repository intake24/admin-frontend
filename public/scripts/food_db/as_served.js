angular.module('intake24.admin.food_db').controller('AsServedSetController', ['$scope', 'FoodDataReader', 'Drawers', function ($scope, foodDataReader, drawers) {

	var _resultObj = null;

	var _resultField = null;

	$scope.asServedImageSets = null;

	function reloadAsServedSets() {
		foodDataReader.getAsServedImageSets(function(asServedSets) {
			$scope.asServedImageSets = asServedSets;
		},
		$scope.handleError);
	}

	$scope.$on("intake24.admin.food_db.AsServedSetDrawerOpened", function(event, resultObj, resultField) {
		_resultObj = resultObj;
		_resultField = resultField;
	});

	$scope.$on("intake24.admin.LoggedIn", function(event) {
		reloadAsServedSets();
	});

	$scope.setAsServedImageSet = function(image_set_id) {
		_resultObj[_resultField] = image_set_id;
		drawers.hideDrawer();
	}

}]);
