// Search (SearchController)

angular.module("intake24.admin.food_db").controller('SearchController', ['$scope', 'FoodDataReader', 'Packer', 'CurrentItem', function($scope, foodDataReader, packer, currentItem) {

	$scope.searchResults = null;


/*	function updateItems(newItem, oldItem)
	{
		if (oldItem.code == $scope.SharedData.originalCode) {

			if ($scope.SharedData.currentItem.hasOwnProperty('temp')) {
				if ($scope.SharedData.currentItem.temp.hasOwnProperty('update_code')) {
					delete $scope.SharedData.currentItem.temp.update_code;
					oldItem.code = newItem.code = $scope.SharedData.currentItem.temp.code;
				}
			}
		}

		if (oldItem.code == newItem.code) {

			oldItem.editing = !angular.equals(oldItem.englishDescription, newItem.englishDescription);

			newItem.children = (oldItem.hasOwnProperty('children')) ? oldItem.children : [];

			angular.merge(oldItem, newItem);
		}

		if (oldItem.hasOwnProperty('children')) {
			$.each(oldItem.children, function(key, value) { updateItems(newItem, value); })
		}

	}*/

	// Add click and mouse enter/leave events to search wrapper
	$('.search-field-wrapper').on('click', function() {

		$(this).addClass('active');

	}).on('mouseenter', function() {

		$(this).addClass('active');

	}).on('mouseleave', function() {

		if ($('#search-field').val() == '') {
			$('#search-field').blur();
			$(this).removeClass('active');
		}
	})

	// Detect change of search query and update results
	$('#search-field').on('input', function(e) {

		performFoodSearch($(this).val());

	}).keypress(function(e) {

		if (e.keyCode == 13) { performFoodSearch($(this).val()); }
	});

	function performFoodSearch(query) {
		$scope.searchResults = [];

		if (query == '') {
			$('.food-list-container').addClass('visible');
			$('#search-results').removeClass('visible');
			return;
		} else {
			$('.food-list-container').removeClass('visible');
			$('#search-results').addClass('visible');
		}

		foodDataReader.searchCategories(query, function(categories) {
			$scope.searchResults = $scope.searchResults.concat($.map(categories, packer.unpackCategoryHeader));
		},
		$scope.handleError);

		foodDataReader.searchFoods(query, function(foods) {
			$scope.searchResults = $scope.searchResults.concat($.map(foods, packer.unpackFoodHeader));
		},
		$scope.handleError);
	}

	$scope.resultSelected = function($event, value) {

		$('#search-results ul li').removeClass('active');

		$($event.target).addClass('active');

		currentItem.setCurrentItem(value);
	}

}]);
