// Explorer (ExplorerController)

angular.module('intake24.admin.food_db').controller('ExplorerController',
	['$scope', '$http', 'SharedData', 'Problems', 'CurrentItem', 'FoodDataReader',
	'Packer', 'Locales', function($scope, $http, sharedData, problems, currentItem, foodDataReader, packer, locales) {

	// Load shared data
	$scope.SharedData = sharedData;

	$scope.rootCategories = [];

	$scope.uncategorisedFoods = [];

	// Watch the current item for changes
	/*$scope.$watch('SharedData.currentItem', function(newItem) {

		$.each($scope.SharedData.treeData, function(key, value) {

			// Update items in the food list as they are modified
			updateItems(newItem, value);

		});

	}, true);*/

	$scope.$on("intake24.admin.LoggedIn", function(event) {
		reloadRootCategories();
		reloadUncategorisedFoods();
	});

	$scope.$on("intake24.admin.food_db.CurrentItemUpdated", function(event, updateEvent) {
		function maybeUpdateNode(node) {
			if (node.code == updateEvent.originalCode && node.type == updateEvent.type) {
				node.code = updateEvent.code;
				node.englishDescription = updateEvent.englishDescription;
				node.localDescription = updateEvent.localDescription;
				node.displayName = node.localDescription.defined ? node.localDescription.value : node.englishDescription;
			}
		}

		function updateCategory(categoryNode) {
			if (categoryNode.children) {
				$.each(categoryNode.children, function (i, node) {
					maybeUpdateNode(node);
					if (node.type == 'category')
						updateCategory(node);
					});
				}
		}

		$.each ($scope.rootCategories, function (i, cat) {
			updateCategory(cat);
		});
	});

	$scope.getText = function(s) {
		return gettext(s);
	}

	// Show a container and hide all others
	function showContainer(container_id)
	{
		$('.properties-container').hide();
		$(container_id).show();
	}



	$scope.returnHome = function() {

		$('#properties-col').show().removeClass('fullwidth');
		$('.properties-container').hide();
		$('#food-list-col').show();

	}

	$scope.removeFromCategory = function() {

		$scope.reloadCategories();

		$.each($scope.SharedData.currentItem.parentCategories, function(index, value) {

			if (value.remove) {

				// Item is flagged for removal so lets remove it!
				var food_code = $scope.SharedData.currentItem.code;
				var category_code = value.code;

				var api_endpoint = ($scope.SharedData.currentItem.type == 'category') ? api_base_url + 'categories/' + category_code + '/subcategories/' + $scope.SharedData.currentItem.code : api_base_url + 'categories/' + category_code + '/foods/' + $scope.SharedData.currentItem.code;

				$http({
					method: 'DELETE',
					url: api_endpoint,
					headers: { 'X-Auth-Token': Cookies.get('auth-token') }
				}).then(function successCallback(response) {

					showMessage(gettext('Removed from selected categories'), 'success');

					$scope.SharedData.currentItem.code = $scope.SharedData.originalCode;
					$scope.fetchProperties();

					getChildren({code: category_code, type: 'category'});

				}, function errorCallback(response) { showMessage(gettext('Failed to remove from categories'), 'danger'); });
			};
		});

	}

	$scope.uncategorisedNodeMarkerClass = function() {
		var cls = ['fa', 'fa-fw', 'fa-circle'];
		if ($scope.uncategorisedFoodsExist())
			cls.push('problems');
		return cls;
	}

	$scope.nodeMarkerClass = function(node) {
		var cls = ['fa', 'fa-fw'];

		if (node.type == 'food') {
			cls.push('fa-circle-o');
		} else
			cls.push('fa-circle');

		if ($scope.hasProblems(node))
			cls.push('problems');

		if (node.changed)
			cls.push('editing');

		return cls;
	}

	$scope.hasProblems = function (node) {
		if (node.type == 'food')
			return (node.problems != null && node.problems.length > 0);
		else if (node.type == 'category')
			return (node.recursiveProblems != null &&
				(node.recursiveProblems.categoryProblems.length > 0 ||
				node.recursiveProblems.foodProblems.length > 0));
	}

	function reloadUncategorisedFoods()
	{
		foodDataReader.getUncategorisedFoods( function (foods) {
			$.each(foods, function (index, node) { node.type = 'food' })
			$scope.uncategorisedFoods = foods;
			},
			$scope.handleError
		);
	}

	function loadProblemsForNode(node) {
		if (node.type == 'category') {
			problems.getCategoryProblemsRecursive(node.code,
				function(problems) { node.recursiveProblems = problems; },
				function(response) { $scope.handleError(response);}
			);
		} else if (node.type == 'food') {
			problems.getFoodProblems(node.code,
				function(problems) {node.problems = problems; },
				function(response) { $scope.handleError (response); }
			);
		} else {
			console.error("Node has no type tag -- probably incorrect argument");
		}
	}

	function reloadRootCategories() {
		foodDataReader.getRootCategories( function(categories) {

			$scope.rootCategories = [];

			var unpacked = $.map(categories, packer.unpackCategoryHeader);

			$.each(unpacked, function (index, node) {
				loadProblemsForNode(node);
				$scope.rootCategories.push(node);
			});
		},
		$scope.handleError);
	}

	function loadChildren(node) {
		if (node.type != 'category')
			console.error("Attempt to load children of a non-category node: " + node.code);

		foodDataReader.getCategoryContents(node.code, function(contents) {
			var subcategories = $.map(contents.subcategories, packer.unpackCategoryHeader);
			var foods = $.map(contents.foods, packer.unpackFoodHeader);
			var children = subcategories.concat(foods);

			$.each(children, function (index, node) { loadProblemsForNode(node); });

			node.children = children;
		},
		$scope.handleError);
	}

	$scope.uncategorisedFoodsExist = function() {
		return $scope.uncategorisedFoods.length > 0;
	}

	function nodeClicked($event) {
		var nodeAnchor = $($event.target).closest('a');
		var nodeLi = nodeAnchor.parent();

		// Selection highlight

		$('.food-list ul li a').removeClass('active');
		nodeAnchor.addClass('active');

		nodeLi.toggleClass('node-open');

		return nodeLi.hasClass('node-open');
	}

	$scope.nodeSelected = function($event, node) {
		var nodeOpen = nodeClicked($event);

		if (nodeOpen && node.type == 'category')
			loadChildren(node);

		currentItem.setCurrentItem(node);


/*		if (value.type == 'uncategorised') {

		} else {
			$scope.SharedData.currentItem = value;
			$scope.SharedData.originalCode = value.code; // ? what's the originalCode for
		}*/

		// Refresh children if the node is about to be expanded
		// No need to refresh if the node is being collapsed
		//if (nodeOpen) {
				//$scope.getChildren(value);
		//}
	}

	$scope.searchResultSelected = function($event, node) {

	}

	$scope.uncategorisedNodeSelected = function($event) {
		if (nodeClicked($event)) {
			reloadUncategorisedFoods();
		}
	}

	$scope.copyEnglishMethods = function() {

		var api_endpoint = ($scope.SharedData.currentItem.type == 'category') ? api_base_url + 'categories/en_GB/' + $scope.SharedData.originalCode + '/definition' : api_base_url + 'foods/en_GB/' + $scope.SharedData.originalCode + '/definition';

		$http({
			method: 'GET',
			url: api_endpoint,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$scope.SharedData.currentItem.localData = response.data.localData;

			unpackCurrentItemService.broadcast();

		}, function errorCallback(response) { $scope.handleError(response); });
	}

	function fetchNutrientTables()
	{
		$http({
			method: 'GET',
			url: api_base_url + 'nutrient-tables',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$scope.SharedData.nutrientTables = response.data;

		}, function errorCallback(response) { $scope.handleError(response); });
	}

	// Food Actions

	$scope.addFood = function() {

		packCurrentItemService.broadcast();

		delete $scope.SharedData.currentItem.version;

		$scope.SharedData.currentItem.groupCode = $scope.SharedData.selectedFoodGroup.id;

		$http({
			method: 'POST',
			url: api_base_url + 'foods/new',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem
		}).then(function successCallback(response) {

			$.each($scope.SharedData.topLevelCategories, function(index, value) {

				if (value.state == 'add') {
					addFoodToCategory($scope.SharedData.currentItem.code, value.code);
				}

			});

			showMessage(gettext('Food added'), 'success');

			$scope.SharedData.originalCode = $scope.SharedData.currentItem.code;

			$scope.updateLocalFood();

			$scope.SharedData.currentItem = new Object();

			$('input').removeClass('valid invalid');

		}, function errorCallback(response) { showMessage(gettext('Failed to add food'), 'danger'); console.log(response); });
	}

	$scope.deleteFood = function() {

		if (confirm("Delete " + $scope.SharedData.currentItem.code + "?"))
		{
			$scope.selected_node.remove();

			var food_code = $scope.SharedData.currentItem.code;

			$http({
				method: 'DELETE',
				url: api_base_url + 'foods/' + food_code,
				headers: { 'X-Auth-Token': Cookies.get('auth-token') }
			}).then(function successCallback(response) {

				showMessage(gettext('Food deleted'), 'success');

				$scope.SharedData.currentItem = new Object();

				resetProperties();

			}, function errorCallback(response) { showMessage(gettext('Failed to delete food'), 'danger'); });
		}
	}

	$scope.updateFood = function() {

		packCurrentItemService.broadcast();

		$scope.SharedData.currentItem.groupCode = $scope.SharedData.selectedFoodGroup.id;

		$http({
			method: 'POST',
			url: api_base_url + 'foods/' + $scope.SharedData.originalCode,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem
		}).then(function successCallback(response) {

			$.each($scope.SharedData.topLevelCategories, function(index, value) {

				if (value.state == 'add') {
					addFoodToCategory($scope.SharedData.originalCode, value.code);
				}

				if (value.state == 'remove') {

					var category_code = value.code;

					var api_endpoint = ($scope.SharedData.currentItem.type == 'category') ? api_base_url + 'categories/' + category_code + '/subcategories/' + $scope.SharedData.currentItem.code : api_base_url + 'categories/' + category_code + '/foods/' + $scope.SharedData.currentItem.code;

					$http({
						method: 'DELETE',
						url: api_endpoint,
						headers: { 'X-Auth-Token': Cookies.get('auth-token') }
					}).then(function successCallback(response) {

						showMessage(gettext('Removed from selected categories'), 'success');

					}, function errorCallback(response) { showMessage(gettext('Failed to remove from categories'), 'danger'); });

				}

			});

			showMessage(gettext('Food updated'), 'success');

			$scope.SharedData.originalCode = $scope.SharedData.currentItem.code;

			$scope.updateLocalFood();

		}, function errorCallback(response) { showMessage(gettext('Failed to update food'), 'danger'); console.log(response); });
	}

	$scope.updateLocalFood = function() {

		$scope.SharedData.currentItem.localData.localDescription = (locales.current() == 'en_GB') ? [$scope.SharedData.currentItem.englishDescription] : $scope.SharedData.currentItem.localData.localDescription;

		$http({
			method: 'POST',
			url: api_base_url + 'foods/' + locales.current() + '/' + $scope.SharedData.originalCode,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem.localData
		}).then(function successCallback(response) {

			showMessage(gettext('Local food updated'), 'success');

			$scope.fetchProperties();

		}, function errorCallback(response) { showMessage(gettext('Failed to update local food'), 'danger'); console.log(response); $scope.fetchProperties(); });
	}

	// Category Actions

	$scope.addCategory = function() {

		packCurrentItemService.broadcast();

		delete $scope.SharedData.currentItem.version;

		$http({
			method: 'POST',
			url: api_base_url + 'categories/new',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem
		}).then(function successCallback(response) {

			$.each($scope.SharedData.topLevelCategories, function(index, value) {

				if (value.state == 'add') {
					addCategoryToCategory($scope.SharedData.currentItem.code, value.code);
				}

			});

			showMessage(gettext('Category added'), 'success');

			$scope.SharedData.originalCode = $scope.SharedData.currentItem.code;

			$scope.updateLocalCategory();

			$scope.SharedData.currentItem = new Object();

			$('input').removeClass('valid invalid');

		}, function errorCallback(response) { showMessage(gettext('Failed to add category'), 'danger'); console.log(response); });
	}

	$scope.discardCategoryChanges = function() {

		$scope.SharedData.currentItem.code = $scope.SharedData.originalCode;
		$scope.fetchProperties();

		showMessage(gettext('Changes discarded'), 'success');
	}

	$scope.deleteCategory = function() {

		if (confirm("Delete " + $scope.SharedData.currentItem.code + "?"))
		{
			$scope.selected_node.remove();

			var category_code = $scope.SharedData.currentItem.code;

			$http({
				method: 'DELETE',
				url: api_base_url + 'categories/' + category_code,
				headers: { 'X-Auth-Token': Cookies.get('auth-token') }
			}).then(function successCallback(response) {

				showMessage(gettext('Category deleted'), 'success');

				resetProperties();

			}, function errorCallback(response) { showMessage(gettext('Failed to delete category'), 'danger'); });
		}
	}

	$scope.handleError = function(response)
	{
		console.log(response);
		if (response.status === 401) { showMessage(gettext('You are not authorized'), 'danger'); Cookies.remove('auth-token'); }
	}
}]);
