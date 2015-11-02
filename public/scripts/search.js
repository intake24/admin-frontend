// Search (SearchController)

app.controller('SearchController', function($scope, $http) {
	
	// Init object to store search results
	$scope.search = new Object();
	
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

		var query = $(this).val();
		performFoodSearch(query);

	}).keypress(function(e) {

		if (e.keyCode == 13) {
			var query = $(this).val();
			performFoodSearch(query);
		}
	});

	function performFoodSearch(query) {
		
		$('#search-results ul').html('');

		if (query == '') {
			$('.food-list-container').show();
			return;
		} else {
			$('.food-list-container').hide();
		}

		$http({
			method: 'GET',
			url: api_base_url + 'foods/' + locale + '/search/' + query,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			console.log(response);

			var type = 'food';

			$scope.search = new Object();

			$.each(response.data, function(index, value) {

				$('#search-results ul').append('<li data-type="' + type + '" data-index="' + index + '">' + value.englishDescription + '</li>');
				$scope.search[index] = value;
			});

			addSearchResultHandlers();

		}, function errorCallback(response) { handleError(response); });

	}

	function addSearchResultHandlers() {

		$('#search-results ul li').off().click(function() {

			$('#search-results ul li').removeClass('active');

			$(this).addClass('active');

			var type = $(this).attr('data-type');
			var index = $(this).attr('data-index');

			$('#properties-col').addClass('active');

			var item = $scope.search[index];

			switch (type) {

				case "category":

					$('#category-properties-container').show();
					$('#food-properties-container').hide();

					// Category selected so lets fetch that definition
					$http({
						method: 'GET',
						url: api_base_url + 'categories/' + locale + '/' + item.code + '/definition',
						headers: { 'X-Auth-Token': Cookies.get('auth-token') }
					}).then(function successCallback(response) {

						console.log(response);

					}, function errorCallback(response) { handleError(response); });

					$('#input-category-code').val(item.code);
					$('#input-category-englishDescription').val(item.englishDescription);
					break;

				case "food":
						
					$('#category-properties-container').hide();
					$('#food-properties-container').show();

					// Food selected so lets fetch that definition
					$http({
						method: 'GET',
						url: api_base_url + 'foods/en/' + item.code + '/definition',
						headers: { 'X-Auth-Token': Cookies.get('auth-token') }
					}).then(function successCallback(response) {

						// console.log(response);
						console.log(response.data.attributes.sameAsBeforeOption);

						$('#input-food-code').val(response.data.code);
						$('#input-food-englishDescription').val(response.data.englishDescription);
						$('#input-NDNS-code').val(response.data.nutrientTableCodes.NDNS);

						var checked = (response.data.attributes.readyMealOption.length == 0) ? false : response.data.attributes.readyMealOption[0];
						$('#input-ready-meal-option').prop("checked", checked);

						var checked = (response.data.attributes.sameAsBeforeOption.length == 0) ? false : response.data.attributes.sameAsBeforeOption[0];
						$('#input-same-as-before-option').prop("checked", checked);

						$('#input-reasonable-amount').val(response.data.attributes.reasonableAmount); // TODO
						// response.data.groupCode
						// response.data.attributes.portionSize
						// response.data.attributes.reasonableAmount
						// response.data.attributes.sameAsBeforeOption

					}, function errorCallback(response) { handleError(response); });

					break;

				default:
			}
		})
	}

	function handleError(response) {

		console.log(response);
		if (response.status === 401) { alert('Unauthorized'); Cookies.remove('auth-token'); }
	}

});