// Search (SearchController)

app.controller('SearchController', function($scope, $http, SharedData, fetchPropertiesService) {

	// Init object to store search results
	$scope.search = new Object();
	$scope.SharedData = SharedData;

	$scope.$watch('SharedData.currentItem', function(newItem) {

		$.each($scope.search, function(key, value) {

			updateItems(newItem, value);

		});

	}, true);

	function updateItems(newItem, oldItem)
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
			
	}
	
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

		$scope.search = [];

		if (query == '') {
			$('.food-list-container').addClass('visible');
			$('#search-results').removeClass('visible');
			return;
		} else {
			$('.food-list-container').removeClass('visible');
			$('#search-results').addClass('visible');
		}

		$http({
			method: 'GET',
			url: api_base_url + 'categories/' + $scope.SharedData.locale.intake_locale + '/search/' + query,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$.each(response.data, function(index, value) { value.type = 'category'; })
			$scope.search = $scope.search.concat(response.data);

		}, function errorCallback(response) { handleError(response); });

		$http({
			method: 'GET',
			url: api_base_url + 'foods/' + $scope.SharedData.locale.intake_locale + '/search/' + query,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$.each(response.data, function(index, value) { value.type = 'food'; })
			$scope.search = $scope.search.concat(response.data);

		}, function errorCallback(response) { handleError(response); });

	}

	$scope.resultSelected = function($event, value) {

		$('#search-results ul li').removeClass('active');

		$($event.target).addClass('active');

		$scope.SharedData.currentItem = value;

		$scope.SharedData.originalCode = value.code;

		// $scope.SharedData.currentItem.type = 'category';

		fetchPropertiesService.broadcast();
	}

	function handleError(response) {

		console.log(response);
		if (response.status === 401) { alert('Unauthorized'); Cookies.remove('auth-token'); }
	}

});