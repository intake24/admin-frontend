// Explorer (ExplorerController)

angular.module('intake24.admin.food_db').controller('ExplorerController',
	['$scope', '$http', 'SharedData', 'Problems', 'CurrentItem', 'FoodDataReader',
	'Packer', 'Locales', '$q', '$rootScope', function($scope, $http, sharedData, problems, currentItem, foodDataReader, packer, locales, $q, $rootScope) {

	// Load shared data
	$scope.SharedData = sharedData;

	$scope.rootCategories = [];

	$scope.selectedNode = null;

	$scope.$on("intake24.admin.LoggedIn", function(event) {
		reloadRootCategoriesDeferred().catch($scope.handleError);
	});

	$scope.$on("intake24.admin.food_db.CurrentItemUpdated", function(event, updateEvent) {
		var selectedNodeRemoved = false;

		// parentNode can be null (for root category nodes)
		function processNodes(nodes, parentNode) {
			var index = -1;

			$.each(nodes, function (i, node) {
				if (node.code == updateEvent.originalCode && node.type == updateEvent.header.type) {
					_.extend(nodes[i], updateEvent.header);
					index = i;
				}

				if (node.type == 'category' && node.children && node.open)
				// Performance: should be tail recursion, no real need to keep index on the stack
					processNodes(node.children, node);
			});

			// If the node matching the update event is in the current node list
			if (index > -1) {
				// Remove the node from the list if:
				//  - The node was not a root category node and it is no longer contained in the category represented by parentNode
				//  - The node was an uncategorised food node and it is no longer uncategorised (has 1+ parent categories)
				//  - The node was a root category node and it is no longer a root category (has 1+ parent categories)
				if (
						(parentNode && (updateEvent.parentCategories.indexOf(parentNode.code) == -1)) ||
						(parentNode && (updateEvent.parentCategories.length > 0) && (parentNode.code == '$UNCAT')) ||
						(!parentNode && (updateEvent.header.type == 'category') && (updateEvent.parentCategories.length > 0))
					) {
						if (nodes[index].selected)
							selectedNodeRemoved = true;
						nodes.splice(index, 1);
				}
			} else {
				// Add node to the list:
				// - The node is now in the category represented by parentNode
				// - The node now has 0 parent categories and parentNode is the uncategorised categories node
				// - The node is now a root category node (is a category and has 0 parent categories)
				if (
					(parentNode && (updateEvent.parentCategories.indexOf(parentNode.code) > -1)) ||
					(parentNode && (updateEvent.parentCategories.length == 0) && (parentNode.code == '$UNCAT')) ||
					(!parentNode && (updateEvent.header.type == 'category') && (updateEvent.parentCategories.length == 0))
				) {
					nodes.push(updateEvent.header);
				}
			}
		}

		processNodes($scope.rootCategories, null);

		if (selectedNodeRemoved || updateEvent.newItem)
			makeVisibleAndSelect(updateEvent.header);
	});

	function parentCategoryNodeForNewItem() {
		if ($scope.selectedNode == null)
			return $scope.rootCategories[0];
		else if ($scope.selectedNode.type == 'category')
			return $scope.selectedNode;
		else
			return $scope.selectedNode.parentNode;
	}

	$scope.$on("intake24.admin.food_db.AddNewFood", function(event, updateEvent) {

		var parentNode = angular.copy(parentCategoryNodeForNewItem());

		var newFood = {
			version: "",
			code: "",
			englishDescription: "New food",
			groupCode: 0,
			attributes: {
				readyMealOption: { defined: false, value: null },
				sameAsBeforeOption: { defined: false, value: null },
				reasonableAmount: { defined: false, value: null },
			},
			localData: {
				version: { defined: false, value: null },
				localDescription: { defined: false, value: null },
				nutrientTableCodes: [],
				portionSize: []
			}
		}

		var header = {
			type: "food",
			code: newFood.code,
			englishDescription: newFood.englishDescription,
			localDescription: newFood.localData.localDescription,
			displayName: newFood.englishDescription
		}

		$rootScope.$broadcast("intake24.admin.food_db.NewItemCreated", newFood, header, parentNode);

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

	function loadProblemsForNodeDeferred(node) {
		if ( (node.type == 'category') && ( node.code != '$UNCAT') )
			return problems.getCategoryProblemsRecursive(node.code).then( function(problems) {
				node.recursiveProblems = problems;
			})
		else if ( (node.type == 'category') && (node.code == '$UNCAT') ) {
			return foodDataReader.getUncategorisedFoods().then ( function (uncategorisedFoods) {
				node.recursiveProblems = {
					foodProblems: _.map(_.take(uncategorisedFoods, 10), function(food) {
						var unpacked = packer.unpackFoodHeader(food);
						return {
							foodName: unpacked.displayName,
							foodCode: unpacked.code,
							problemCode: "food_not_categorised"
						}
					}),
					categoryProblems: []
				}
			});
		}
		else if (node.type == 'food')
			return problems.getFoodProblems(node.code).then( function(problems) {
				node.problems = problems;
			});
		else
			return $q.reject("Node has no type tag -- probably incorrect argument");
	}

	function reloadRootCategoriesDeferred() {
		return foodDataReader.getRootCategories().then( function(categories) {
			$scope.rootCategories = $.map(categories, packer.unpackCategoryHeader);

			$scope.rootCategories.unshift (
				{
					displayName: "Uncategorised foods", //FIXME: use localised string
					code: "$UNCAT",
					type: "category",
					children: []
				}
			);

			 return $q.all($.map($scope.rootCategories, function(node) { return loadProblemsForNodeDeferred(node) }));
		 });
	}

	function loadChildrenDeferred(node) {
		if (node.type != 'category')
			console.error("Attempt to load children of a non-category node: " + node.code);

		var childrenDeferred;

		if (node.code == "$UNCAT")
			childrenDeferred = foodDataReader.getUncategorisedFoods().then(function (foods) {
				return $.map(foods, packer.unpackFoodHeader);
			});
		else
			childrenDeferred = foodDataReader.getCategoryContents(node.code).then(function(contents) {
				var subcategories = _.map(contents.subcategories, packer.unpackCategoryHeader);
				var foods = _.map(contents.foods, packer.unpackFoodHeader);
				return subcategories.concat(foods);
			});

		return childrenDeferred.then(function (children) {
			node.children = children;
			_.each(node.children, function(n) { n.parentNode = node });
			return $q.all($.map(node.children, function (node) { loadProblemsForNodeDeferred(node); }));
		});
	}

	function loadChildren(node) {
		loadChildrenDeferred(node).catch($scope.handleError);
	}

	function findNodeInTree(node) {

		function match(n) { return n.type == node.type && n.code == node.code };

		// First check if the node is one of the root categories
		var targetNode = _.find($scope.rootCategories, match);

		if (targetNode) {
				return $q.when(targetNode);
		} else {
			// Try to find the node in the tree
			var allParentCategoriesDeferred = null;

			if (node.type == "food") {
				allParentCategoriesDeferred = foodDataReader.getFoodAllCategories(node.code);
			} else if (node.type == "category") {
				allParentCategoriesDeferred = foodDataReader.getCategoryAllCategories(node.code);
			}

			return allParentCategoriesDeferred.then(function (allCategories) {

				var allCategoryCodes = _.map(allCategories, function (c) { return c.code; });

				if (allCategoryCodes.length == 0) {
					// Check the uncategorised foods

					return foodDataReader.getUncategorisedFoods().then( function (foods) {
						$scope.rootCategories[0].open = true;
						$scope.rootCategories[0].children = _.map(foods, packer.unpackFoodHeader);
						targetNode = _.find($scope.rootCategories[0].children, match);
						if (targetNode)
							return $q.when(targetNode);
						else
							return $q.reject("Failed to find selected node in the food tree");
					});
				} else {
					function find(topLevelCategories) {
						var category = _.find(topLevelCategories, function (cnode) { return _.contains(allCategoryCodes, cnode.code) });

						if (category)
							return loadChildrenDeferred(category).then(function () {
								category.open = true;

								var targetNode = _.find(category.children, match);

								if (targetNode)
									return $q.when(targetNode);
								else
									return find(_.filter(category.children, function(n) { return n.type == "category"}));
							});
						else
							return $q.reject("Failed to find selected node in the food tree");
						}

						return find($scope.rootCategories);
				}
			});
		}
	}

	function makeVisibleAndSelect(node) {
		findNodeInTree(node).then (function (n) {
			console.log("MAKE VISIBLE");
			console.log(n);
			clearSelection();
			selectNode(n);
			setTimeout(function() {
				var targetElement = $("#food-list-col ul a.active")[0];
				$("#food-list-col").animate( {
					scrollTop: targetElement.offsetTop - $("header").height() - 5
				}, 500);
			}, 0);
		}, $scope.handleError);
	}

	$scope.uncategorisedFoodsExist = function() {
		return $scope.uncategorisedFoods.length > 0;
	}

	function selectNode(node) {
		clearSelection();

		$scope.selectedNode = node;
		$scope.selectedNode.selected = true;

		if ($scope.selectedNode.type == 'category') {
			$scope.selectedNode.open = !$scope.selectedNode.open;
			if ($scope.selectedNode.open)
				loadChildren(node);
		}

		// Don't show properties for the uncategorised foods node
		if (($scope.selectedNode.type != 'category') || ($scope.selectedNode.code != '$UNCAT'))
			currentItem.setCurrentItem($scope.selectedNode);
	}

	function clearSelection() {
		if ($scope.selectedNode)
			$scope.selectedNode.selected = false;
		$scope.selectedNode = null;
		currentItem.setCurrentItem(null);
	}

	$scope.nodeClicked = function(node) {
		selectNode(node);
	}

	$scope.searchResultSelected = function($event, node) {
		makeVisibleAndSelect(node);
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
		showMessage(gettext('Something went wrong. Please check the console for details.'), 'danger');
		console.log(response);
		if (response.status === 401) { showMessage(gettext('You are not authorized'), 'danger'); Cookies.remove('auth-token'); }
	}
}]);
