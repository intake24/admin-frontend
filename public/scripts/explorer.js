// Explorer (ExplorerController)

app.controller('ExplorerController', function($scope, $http, fetchCategoriesService) {

	// Listen for boradcasts
	fetchCategoriesService.listen(function(event, data) { fetchCategories(); });

	// Init object to store food
	$scope.food = new Object();
	$scope.currentFood = new Object();
	$scope.currentCategory = new Object();

	// Init object to store food groups
	$scope.foodGroups = new Object();

	// Check if codes available
	$('input').keyup(function() {
		if ($(this).attr('id') == 'input-food-code') { checkCode(this, 'foods'); }
		if ($(this).attr('id') == 'input-category-code') { checkCode(this, 'categories'); }
	});

	$('#add-food-btn').click(function() { addFood(); });

	$('#delete-food-btn').click(function()
	{
		if (confirm("Delete " + $scope.currentFood.code + "?"))
		{
			var food_code = $scope.currentFood.code;

			$http({
				method: 'DELETE',
				url: api_base_url + 'foods/' + food_code,
				headers: { 'X-Auth-Token': Cookies.get('auth-token') }
			}).then(function successCallback(response) {

				showMessage('Food deleted', 'success');

				fetchCategoriesService.broadcast();

			}, function errorCallback(response) { showMessage('Failed to delete food', 'danger'); });
		}
	});

	function fetchCategories()
	{
		// Initialise jstree
		$('#food-list').jstree({'core' : {'check_callback': true}});

		$http({
			method: 'GET',
			url: api_base_url + 'categories/' + locale,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			var node = { 'id' : 0, 'index' : 0, 'data' : { 'type' : 'uncategorized' }, 'text' : 'Uncategorized'};

			// Add uncategorized node
			$('#food-list').jstree().create_node('#', node, 'last', function() {
				$scope.food[0] = node;
			});

			$.each(response.data, function(index, value) {
				addNode(value.code, "#", (index + 1), value, 'category');
			});
			
			addHandlers();
			fetchFoodGroups();

		}, function errorCallback(response) { handleError(response); });
	}

	function fetchFoodGroups()
	{
		$http({
			method: 'GET',
			url: api_base_url + 'food-groups/' + locale,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$scope.foodGroups = response.data;

			$.each(response.data, function(index, value) {
				
				$('#food-group-dropdown').append('<option value="' + value.id + '">' + value.englishDescription + '</option>')
			});

		}, function errorCallback(response) { handleError(response); });
	}

	function addHandlers()
	{
		$('#food-list').on("select_node.jstree", function (e, data, node) {

			$('#properties-col').addClass('active');

			var item = $scope.food[data.node.id];

			switch (data.node.data["type"]) {

				case "category":

					$scope.currentCategory = item;

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
					
					$scope.currentFood = item;

					$('#category-properties-container').hide();
					$('#food-properties-container').show();

					// Food selected so lets fetch that definition
					$http({
						method: 'GET',
						url: api_base_url + 'foods/en/' + item.code + '/definition',
						headers: { 'X-Auth-Token': Cookies.get('auth-token') }
					}).then(function successCallback(response) {

						console.log(response);

						$('#input-food-code').val(response.data.code);
						$('#input-food-englishDescription').val(response.data.englishDescription);
						$('#input-NDNS-code').val(response.data.localData.nutrientTableCodes.NDNS);

					}, function errorCallback(response) { handleError(response); });

					break;
			}
		});

		$('#food-list').on("hover_node.jstree", function (e, data, node) {

			if (data.node.children.length != 0) { console.log('has children'); return; };

			// Check if uncategorized node
			if (data.node.data.type == 'uncategorized') {

				$http({
					method: 'GET',
					url: api_base_url + 'foods/' + locale + '/uncategorised',
					headers: { 'X-Auth-Token': Cookies.get('auth-token') }
				}).then(function successCallback(response) {

					console.log(response);

					$.each(response.data, function(index, value) {
						addNode(value.code, data.node.id, index, value, 'food');
					});

				}, function errorCallback(response) { handleError(response); });

			} else {

				if ($scope.food[data.node.id]['loading']) { return; };

				var item = $scope.food[data.node.id];
				
				$scope.food[data.node.id]['loading'] = true;

				$http({
					method: 'GET',
					url: api_base_url + 'categories/' + locale + '/' + item['code'],
					headers: { 'X-Auth-Token': Cookies.get('auth-token') }
				}).then(function successCallback(response) {

					$.each(response.data.subcategories, function(index, value) {
						addNode(value.code, data.node.id, index, value, 'category'); });

					$.each(response.data.foods, function(index, value) {
						addNode(value.code, data.node.id, index, value, 'food'); });

					$scope.food[data.node.id]['loading'] = false;

				}, function errorCallback(response) { handleError(response); });

			}
		});
	}

	function addNode(node_id, parent_id, index, value, type)
	{
		if (value.isHidden)
			return;

		if ($('#' + node_id).length > 0)
			return;

		$('#food-list').jstree().create_node(parent_id, { "id" : node_id, "index" : index, "data" : { "type" : type }, "text" : value.englishDescription}, "last", function() {
			$scope.food[node_id] = value; });
	}

	function addFood()
	{
		var food = {
		  "code": $('#add-new-food-container #input-food-code').val(),
		  "englishDescription": $('#add-new-food-container #input-food-englishDescription').val(),
		  "groupCode": 1,
		  "attributes": {
		    "readyMealOption": [
		      true
		    ],
		    "sameAsBeforeOption": [],
		    "reasonableAmount": []
		  }
		};

		$http({
			method: 'POST',
			url: api_base_url + 'foods/new',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: food
		}).then(function successCallback(response) {

			showMessage('Food added', 'success');

		}, function errorCallback(response) { showMessage('Failed to add food', 'danger'); console.log(response); });
	}

	function addFoodToCategory(food_code, category_code)
	{
		$http({
			method: 'PUT',
			url: api_base_url + 'categories/' + category_code + '/foods/' + food_code,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
		}).then(function successCallback(response) {

			showMessage('Food added to category', 'success');

			fetchCategoriesService.broadcast();

		}, function errorCallback(response) { showMessage('Failed to add to category', 'danger'); console.log(response); });
	}

	function checkCode(input, type)
	{
		var code = $(input).val();

		$http({
			method: 'GET',
			url: api_base_url + type + '/code-available/' + code,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			if (response.data) {
				$(input).removeClass('invalid').addClass('valid');
			} else {

				$(input).removeClass('valid').addClass('invalid');
			}

		}, function errorCallback(response) { handleError(response); });
	}

});