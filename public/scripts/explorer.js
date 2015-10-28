// Explorer (ExplorerController)

app.controller('ExplorerController', function($scope, $http, fetchCategoriesService) {

	// Listen for boradcasts
	fetchCategoriesService.listen(function(event, data) { fetchCategories() });

	// Init object to store food
	$scope.food = new Object();

	function fetchCategories() {

		// Initialise jstree
		$('#food-list').jstree({'core' : {'check_callback': true}});

		$http({
			method: 'GET',
			url: api_base_url + 'categories/' + locale,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$.each(response.data, function(index, value) {
				addNode(value.code, "#", index, value, 'category');
			});
			
			addHandlers();

		}, function errorCallback(response) { handleError(response); });
	}

	function addHandlers() {

		$('#food-list').on("select_node.jstree", function (e, data, node) {

			$('.properties-col').addClass('active');

			var item = $scope.food[data.node.id];

			switch (data.node.data["type"]) {

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

						console.log(response);

						$('#input-food-code').val(response.data.code);
						$('#input-food-englishDescription').val(response.data.englishDescription);
						$('#input-NDNS-code').val(response.data.nutrientTableCodes.NDNS);

					}, function errorCallback(response) { handleError(response); });

					break;
			}
			
		});

		$('#food-list').on("hover_node.jstree", function (e, data, node) {

			if (data.node.children.length != 0) { console.log('has children'); return; };

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
		});
	}

	function addNode(node_id, parent_id, index, value, type) {

		if (value.isHidden)
			return;

		if ($('#' + node_id).length > 0)
			return;

		$('#food-list').jstree().create_node(parent_id, { "id" : node_id, "index" : index, "data" : { "type" : type }, "text" : value.englishDescription}, "last", function() {
			$scope.food[node_id] = value; });
	}

});