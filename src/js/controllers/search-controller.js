'use strict';

module.exports = function(app) {
    app.controller('SearchController', ['$scope', 'FoodDataReader', 'Packer', 'CurrentItem', controllerFun]);
};

function controllerFun($scope, foodDataReader, packer, currentItem) {

	$scope.searchResults = null;

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

		foodDataReader.searchCategories(query).then (function(categories) {
			$scope.searchResults = $scope.searchResults.concat($.map(categories, packer.unpackCategoryHeader));
		},
		$scope.handleError);

		foodDataReader.searchFoods(query).then(function(foods) {
			$scope.searchResults = $scope.searchResults.concat($.map(foods, packer.unpackFoodHeader));
		},
		$scope.handleError);
	}

	$scope.resultClicked = function($event, node) {
		$("#search-field").val("");
		$("#search-field").blur();
		$('.search-field-wrapper').removeClass("active");
		$('.food-list-container').addClass('visible');
		$('#search-results').removeClass('visible');

		// Defined in outer Explorer controller
		$scope.searchResultSelected($event, node);
	}

}