// Explorer (ExplorerController)

app.controller('ExplorerController',
	['$scope', '$http', 'fetchCategoriesService', 'fetchImageSetsService', 'fetchPropertiesService',
 	'packCurrentItemService', 'unpackCurrentItemService', 'SharedData', 'ProblemChecker',
	function($scope, $http, fetchCategoriesService, fetchImageSetsService, fetchPropertiesService,
		packCurrentItemService, unpackCurrentItemService, SharedData, problemChecker) {

	// Listen for boradcasts
	fetchCategoriesService.listen(function(event, data) { $scope.fetchCategories(); });
	fetchImageSetsService.listen(function(event, data) { $scope.fetchImageSets(); });
	fetchPropertiesService.listen(function(event, data) { $scope.fetchProperties(); });

	// Load shared data
	$scope.SharedData = SharedData;

	// Watch the current item for changes
	$scope.$watch('SharedData.currentItem', function(newItem) {

		$.each($scope.SharedData.treeData, function(key, value) {

			// Update items in the food list as they are modified
			updateItems(newItem, value);

		});

	}, true);

	$scope.getText = function(s) {
		return gettext(s);
	}

	$scope.fetchImageSets = function() {

		// Get all as served image sets
		$http({
			method: 'GET',
			url: api_base_url + 'portion-size/as-served',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$scope.SharedData.portionSizes.as_served_image_sets = response.data;

		}, function errorCallback(response) { handleError(response); });

		// Get all guide image sets
		$http({
			method: 'GET',
			url: api_base_url + 'portion-size/guide-image',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$scope.SharedData.portionSizes.guide_image_sets = response.data;

		}, function errorCallback(response) { handleError(response); });

		// Get all guide image sets
		$http({
			method: 'GET',
			url: api_base_url + 'portion-size/drinkware',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$scope.SharedData.portionSizes.drinkware_sets = response.data;

		}, function errorCallback(response) { handleError(response); });
	}

	// Update items in the food list as they are modified
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

	// Show a container and hide all others
	function showContainer(container_id)
	{
		$('.properties-container').hide();
		$(container_id).show();
	}

	// Check if codes available
	$('input').keyup(function() {
		if ($(this).attr('id') == 'input-food-code') { checkCode(this, 'foods'); }
		if ($(this).attr('id') == 'input-category-code') { checkCode(this, 'categories'); }
	});

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

	$scope.nodeMarkerClass = function(node, lang_dir) {
		var cls = ['fa', 'fa-fw'];

		if (node.type == 'food') {
			cls.push('fa-circle-o');
		} else
			cls.push('fa-circle');

		if ($scope.hasProblems(node))
			cls.push('problems');

		if (node.editing)
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

	function resetProperties()
	{
		$('.properties-container').hide();
		$scope.SharedData.currentItem = new Object();
		$('input').removeClass('valid invalid');
	}

	function loadUncategorised()
	{
		$http({
			method: 'GET',
			url: api_base_url + 'foods/' + $scope.SharedData.locale.intake_locale + '/uncategorised',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$.each(response.data, function(index, value) { value.type = 'food'; })

			$scope.SharedData.treeData['UCAT'] = {code: 'UCAT', type: 'uncategorised', englishDescription: 'Uncategorised foods', children: response.data};

		}, function errorCallback(response) { handleError(response); });
	}




	$scope.fetchCategories = function() {

		$scope.fetchAllCategories();

		loadUncategorised();

		$http({
			method: 'GET',
			url: api_base_url + 'categories/' + $scope.SharedData.locale.intake_locale,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$.each(response.data, function(index, value) {
				value.type = 'category';
				$scope.SharedData.treeData[value.code] = value;
				problemChecker.getCategoryProblemsRecursive(value.code,
					function(problems) { value.recursiveProblems = problems; },
					function(response) { handleError(response);}
				);
			})

			$scope.SharedData.topLevelCategories = response.data;

			fetchFoodGroups();

			fetchNutrientTables();

		}, function errorCallback(response) { handleError(response); });
	}

	$scope.fetchAllCategories = function() {

		loadUncategorised();

		$http({
			method: 'GET',
			url: api_base_url + 'categories/' + $scope.SharedData.locale.intake_locale + '/all',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$scope.SharedData.allCategories = response.data;

		}, function errorCallback(response) { handleError(response); });
	}

	$scope.nodeSelected = function($event, value) {
		var node = $($event.target).parent();

		$scope.selected_node = node;

		// Move the selection highlight to the clicked node
		$('.food-list ul li a').removeClass('active');
		node.addClass('active');

		if (value.type == 'uncategorised') {

		} else {
			$scope.SharedData.currentItem = value;
			$scope.SharedData.originalCode = value.code; // ? what's the originalCode for
		}

		// Refresh children if the node is about to be expanded
		// No need to refresh if the node is being collapsed
		if (!node.hasClass('node-open')) {
				$scope.getChildren(value);
		}

		node.toggleClass('node-open');
	}

	$scope.fetchProperties = function() {

		$('#properties-col').addClass('active');
		$('input').removeClass('valid invalid');

		var api_endpoint = ($scope.SharedData.currentItem.type == 'category') ? api_base_url + 'categories/' + $scope.SharedData.locale.intake_locale + '/' + $scope.SharedData.originalCode + '/definition' : api_base_url + 'foods/' + $scope.SharedData.locale.intake_locale + '/' + $scope.SharedData.originalCode + '/definition';

		$http({
			method: 'GET',
			url: api_endpoint,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			response.data.type = $scope.SharedData.currentItem.type;

			$scope.SharedData.currentItem = response.data;

			unpackCurrentItemService.broadcast();

			if ($scope.SharedData.currentItem.type == 'category') {

				fetchParentCategories('categories', $scope.SharedData.currentItem.code);
				$('.properties-container').not('#category-properties-container').hide();

				$('#category-properties-container').css({'display':'block'});

			} else {

				$scope.SharedData.selectedFoodGroup = $scope.SharedData.foodGroups[response.data.groupCode];

				fetchParentCategories('foods', $scope.SharedData.currentItem.code);
				$('.properties-container').not('#food-properties-container').hide();

				$('#food-properties-container').css({'display':'block'});
			}

		}, function errorCallback(response) { handleError(response); });
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

		}, function errorCallback(response) { handleError(response); });
	}

	$scope.getChildren = function(value) {

	  // This will remember the currentItem at the time of async HTTP request
		// so that the correct node is updated
		// FIXME: handle deletion
		var currentItem = $scope.SharedData.currentItem;

		$http({
			method: 'GET',
			url: api_base_url + 'categories/' + $scope.SharedData.locale.intake_locale + '/' + value.code,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$.each(response.data.subcategories, function(index, value) {
				value.type = 'category';
				problemChecker.getCategoryProblemsRecursive(value.code,
					function(problems) { value.recursiveProblems = problems; },
					function(response) { handleError (response); }
				);
			});

			$.each(response.data.foods, function(index, value) {
				value.type = 'food';
				problemChecker.getFoodProblems(value.code,
					function(problems) { value.problems = problems; },
					function(response) { handleError (response); }
				);
			});

			var children = response.data.subcategories.concat(response.data.foods);

			currentItem.children = children;

			$scope.fetchProperties();
		});
	}

	function fetchFoodGroups()
	{
		$http({
			method: 'GET',
			url: api_base_url + 'food-groups/' + $scope.SharedData.locale.intake_locale,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$scope.SharedData.foodGroups = response.data;

		}, function errorCallback(response) { handleError(response); });
	}

	function fetchNutrientTables()
	{
		$http({
			method: 'GET',
			url: api_base_url + 'nutrient-tables',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$scope.SharedData.nutrientTables = response.data;

		}, function errorCallback(response) { handleError(response); });
	}

	function fetchParentCategories(type, item_code)
	{
		$http({
			method: 'GET',
			url: api_base_url + type + '/' + $scope.SharedData.locale.intake_locale + '/' + item_code + '/parent-categories',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$.each($scope.SharedData.topLevelCategories, function(ac_index, ac_value) {

				ac_value.state = 'none';

				$.each(response.data, function(index, value) {
					if (value.code == ac_value.code) {

						ac_value.state = 'existing';

					};
				});

			});

			$scope.SharedData.currentItem.parentCategories = response.data;

		}, function errorCallback(response) { handleError(response); });
	}

	$scope.updateState = function(state) {

		var new_state = '';

		if (state == "existing") { new_state = "remove"; } if (state == "remove") { new_state = "existing"; } if (state == "none") { new_state = "add"; } if (state == "add") { new_state = "none"; };

		return new_state;
	}

	$scope.reloadCategories = function() {

		if (!$scope.SharedData.currentItem.parentCategories) {
			$scope.SharedData.currentItem.parentCategories = [];
		}

		$.each($scope.SharedData.topLevelCategories, function(index, value) {
			if (value.isParentCategory) {
				value.add = true;
				$scope.SharedData.currentItem.parentCategories.push(value);
			}
		});
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

	$scope.discardFoodChanges = function() {

		$scope.SharedData.currentItem.code = $scope.SharedData.originalCode;
		$scope.fetchProperties();

		showMessage(gettext('Changes discarded'), 'success');
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

		$scope.SharedData.currentItem.localData.localDescription = ($scope.SharedData.locale.intake_locale == 'en_GB') ? [$scope.SharedData.currentItem.englishDescription] : $scope.SharedData.currentItem.localData.localDescription;

		$http({
			method: 'POST',
			url: api_base_url + 'foods/' + $scope.SharedData.locale.intake_locale + '/' + $scope.SharedData.originalCode,
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

	$scope.updateCategory = function() {

		packCurrentItemService.broadcast();

		$http({
			method: 'POST',
			url: api_base_url + 'categories/' + $scope.SharedData.originalCode,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem
		}).then(function successCallback(response) {

			$.each($scope.SharedData.topLevelCategories, function(index, value) {

				if (value.state == 'add') {
					addCategoryToCategory(value.code, $scope.SharedData.currentItem.code);
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

			fetchCategoriesService.broadcast();

			showMessage(gettext('Category updated'), 'success');

			$scope.fetchProperties();

			$scope.updateLocalCategory();

		}, function errorCallback(response) { showMessage(gettext('Failed to update category'), 'danger'); console.log(response); });
	}

	$scope.updateLocalCategory = function() {

		$scope.SharedData.currentItem.localData.localDescription = ($scope.SharedData.locale.intake_locale == 'en_GB') ? [$scope.SharedData.currentItem.englishDescription] : $scope.SharedData.currentItem.localData.localDescription;

		$http({
			method: 'POST',
			url: api_base_url + 'categories/' + $scope.SharedData.locale.intake_locale + '/' + $scope.SharedData.originalCode,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem.localData
		}).then(function successCallback(response) {

			showMessage(gettext('Local category updated'), 'success');

			$scope.fetchProperties();

		}, function errorCallback(response) { showMessage(gettext('Failed to update local category'), 'danger'); console.log(response); $scope.fetchProperties(); });
	}

	$scope.removeItem = function(array, index) {
	    array.splice(index, 1);
	}

	$scope.addPortionSize = function(array) {
		array.push({description:'', imageUrl:'', useForRecipes:false, parameters:[]});
	}

	$scope.deletePortionSize = function(array, index) {
		array.splice(index, 1);
	}

	function addFoodToCategory(food_code, category_code)
	{
		$http({
			method: 'PUT',
			url: api_base_url + 'categories/' + category_code + '/foods/' + food_code,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
		}).then(function successCallback(response) {

			showMessage(gettext('Food added to category'), 'success');

			fetchCategoriesService.broadcast();

		}, function errorCallback(response) { showMessage(gettext('Failed to add to category'), 'danger'); console.log(response); });
	}

	function addCategoryToCategory(category_code, subcategory_code)
	{
		$http({
			method: 'PUT',
			url: api_base_url + 'categories/' + category_code + '/subcategories/' + subcategory_code,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
		}).then(function successCallback(response) {

			showMessage(gettext('Category added to category'), 'success');

			fetchCategoriesService.broadcast();

		}, function errorCallback(response) { showMessage(gettext('Failed to add to category'), 'danger'); console.log(response); });
	}

	function checkCode(input, type)
	{
		var code = $(input).val();

		if (code.length < 4) { $(input).removeClass('valid invalid'); return; }

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

	function handleError(response)
	{
		console.log(response);
		if (response.status === 401) { showMessage(gettext('You are not authorized'), 'danger'); Cookies.remove('auth-token'); }
	}

}]);
