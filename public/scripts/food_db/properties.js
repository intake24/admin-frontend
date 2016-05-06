/* Controller responsible for the property editor on the right-hand side of
* the page
*/

angular.module('intake24.admin.food_db').controller('PropertiesController', ['$scope', '$http', 'CurrentItem', 'SharedData', 'FoodDataReader', 'FoodDataWriter', 'UserFoodData', 'Packer', 'Drawers', '$q', function ($scope, $http, currentItem, sharedData, foodDataReader, foodDataWriter, userFoodData, packer, drawers, $q) {

	$scope.sharedData = sharedData;

	// Currently selected item's header.
	// Used for reference and should not be changed in this controller.
	$scope.currentItem = null;

	// A snapshot of the initial item definition.
	// Loaded from the server when the currentItem changes.
	// Used to determine if anything changed to avoid making unneeded API calls.
	$scope.originalItemDefinition = null;

	// Current state of the selected item's properties.
	// Loaded from the server when the currentItem changes,
	// then bound to page controls and can be edited.
	$scope.itemDefinition = null;

  // A snapshot of the initial parent categories state.
	// Loaded from the server when the currentItem changes.
	// Used to generate add/remove category API calls when the item is saved.
	$scope.originalParentCategories = null;

	// Current state of the selected item's parent categories list.
	// Can be edited using the "Manage categories" drawer.
	$scope.parentCategories = null;

	// List of all food groups. Loaded once on controller instantiation.
	$scope.foodGroups = null;

	// Local view of the current food/category in the current locale for debugging
	$scope.localFoodData = null;

	$scope.localFoodDataSources = null;

	$scope.localViewOpen = false;

	$scope.$on('intake24.admin.food_db.CurrentItemChanged', function(event, newItem) {
		// This is just the basic header received from the tree control
		// Editable data will be stored in itemDefinition
		$scope.currentItem = newItem;
		loadProperties();
		loadParentCategories();
		loadLocalFoodData();
	});

	$scope.$on("intake24.admin.LoggedIn", function(event) {
		reloadFoodGroups();
	})

	$scope.$watch("itemChanged()", function(event) {
		currentItem.setChangedState($scope.itemChanged());
	});

	function loadProperties() {

		$('#properties-col').addClass('active');
		$('input').removeClass('valid invalid');

		if ($scope.currentItem.type == 'category') {
			foodDataReader.getCategoryDefinition($scope.currentItem.code,
				function(definition) {
					$scope.itemDefinition = packer.unpackCategoryDefinition(definition);
					$scope.originalItemDefinition = angular.copy($scope.itemDefinition);

					// use ng-if in template for consistency
					$('.properties-container').not('#category-properties-container').hide();
					$('#category-properties-container').css({'display':'block'});
				},
				$scope.handleError
			);
		} else if ($scope.currentItem.type == 'food') {
			foodDataReader.getFoodDefinition($scope.currentItem.code,
				function(definition) {
					$scope.itemDefinition = packer.unpackFoodDefinition(definition);
					$scope.originalItemDefinition = angular.copy($scope.itemDefinition);

					// use ng-if in template for consistency
					$('.properties-container').not('#food-properties-container').hide();
					$('#food-properties-container').css({'display':'block'});
				},
				$scope.handleError
			);
		}
	}

	function loadParentCategories() {
		if ($scope.currentItem.type == 'food') {
			foodDataReader.getFoodParentCategories($scope.currentItem.code,
				function(categories) {
					$scope.parentCategories = $.map(categories, packer.unpackFoodHeader);
					$scope.originalParentCategories = angular.copy($scope.parentCategories);
				},
				$scope.handleError
			);
		} else if ($scope.currentItem.type == 'category') {
			foodDataReader.getCategoryParentCategories($scope.currentItem.code,
				function(categories) {
					$scope.parentCategories = $.map(categories, packer.unpackCategoryHeader);
					$scope.originalParentCategories = angular.copy($scope.parentCategories);
				},
				$scope.handleError
			);
		}
	}

	function loadLocalFoodData() {
		if ($scope.currentItem.type == 'food') {
			userFoodData.getFoodDataWithSources($scope.currentItem.code,
				function(data) {
					$scope.localFoodData = data[0];
					$scope.localFoodDataSources = data[1];
				},
				function(response) {
					if (response.code == 404) {
						// 404 is expected and means that local food data is not defined
						$scope.localFoodData = null;
					} // anything else is an error
					else $scope.handleError(response);
				}
			);
		}
	}

	function reloadFoodGroups() {
		foodDataReader.getFoodGroups(function(groups) {
			$scope.foodGroups = $.map(groups, packer.unpackFoodGroup);
		},
		$scope.handleError);
	}

	function exists(categoryList, categoryHeader) {
		for (var i = 0; i < categoryList.length; i++) {
			if (categoryList[i].code == categoryHeader.code)
				return true;
		}
		return false;
	}

	function parentCategoryChanges() {
		if ($scope.parentCategories && $scope.originalParentCategories)
			return {
				add_to: $.grep($scope.parentCategories, function(pc) { return !exists($scope.originalParentCategories, pc); }),
				remove_from: $.grep($scope.originalParentCategories, function (cpc) { return !exists($scope.parentCategories, cpc); })
			};
		else
			return {
				add_to: [],
				remove_from: []
			};
	}

	$scope.parentCategoriesChanged = function() {
		var changes = parentCategoryChanges();
		return ((changes.add_to.length + changes.remove_from.length) > 0);
	}

	function buildParentCategoryRequests() {
		var changes = parentCategoryChanges();

		var addRequests = $.map(changes.add_to, function (c) {
			return foodDataWriter.addFoodToCategory($scope.itemDefinition.code, c.code);
		});

		var deleteRequests = $.map(changes.remove_from, function (c) {
			return foodDataWriter.removeFromCategory($scope.itemDefinition.code, c.code);
		});

		return $.when.apply($, addRequests.concat(deleteRequests));
	}

	$scope.commitParentCategories = function() {
		buildParentCategoryRequests().fail(function(response) { $scope.handleError (response); });
	}

	$scope.categoryBasicDefinitionChanged = function() {
		if ($scope.originalItemDefinition && $scope.itemDefinition)
			return !angular.equals(packer.packCategoryDefinition($scope.originalItemDefinition), packer.packCategoryDefinition($scope.itemDefinition));
		else
			return false;
	}

	$scope.categoryLocalDefinitionChanged = function() {
		if ($scope.originalItemDefinition && $scope.itemDefinition)
			return !angular.equals(packer.packCategoryLocalDefinition($scope.originalItemDefinition), packer.packCategoryLocalDefinition($scope.itemDefinition));
		else
			return false;
	}

	$scope.foodBasicDefinitionChanged = function() {
		if ($scope.originalItemDefinition && $scope.itemDefinition) {
			var packedOriginalBasic = packer.packFoodBasicDefinition($scope.originalItemDefinition);
			var packedCurrentBasic = packer.packFoodBasicDefinition($scope.itemDefinition);
			return !angular.equals(packedOriginalBasic, packedCurrentBasic);
		}
		else
			return false;
	}

	$scope.foodLocalDefinitionChanged = function() {
		if ($scope.originalItemDefinition && $scope.itemDefinition) {
			var packedOriginalLocal = packer.packFoodLocalDefinition($scope.originalItemDefinition.localData);
			var packedCurrentLocal = packer.packFoodLocalDefinition($scope.itemDefinition.localData);
			return !angular.equals(packedOriginalLocal, packedCurrentLocal);
		}
		else
			return false;
	}

	$scope.foodChanged = function() {
		return $scope.foodBasicDefinitionChanged() || $scope.foodLocalDefinitionChanged() || $scope.parentCategoriesChanged();
	}

	$scope.categoryChanged = function() {
		return $scope.categoryBasicDefinitionChanged() || $scope.categoryLocalDefinitionChanged() || $scope.parentCategoriesChanged();
	}

	$scope.itemChanged = function() {
		if ($scope.currentItem && $scope.currentItem.type == 'food')
			return $scope.foodChanged();
		else if ($scope.currentItem && $scope.currentItem.type == 'category')
			return $scope.categoryChanged();
		return false;
	}

	$scope.commitCategory = function() {
		if (categoryBasicDefinitionChanged()) {
			foodDataWriter.updateCategoryBase($scope.originalItemDefinition.code, packer.packCategoryDefinition($scope.itemDefinition)).fail($scope.handleError);
		}

		if (categoryLocalDefinitionChanged()) {
			foodDataWriter.updateCategoryLocal($scope.originalItemDefinition.code, packer.packCategoryLocalDefinition($scope.itemDefinition)).fail($scope.handleError);
		}

		$scope.commitParentCategories();
	}

	$scope.commitFood = function() {
		if (foodBasicDefinitionChanged()) {
			foodDataWriter.updateFoodBase($scope.originalItemDefinition.code, packer.packFoodDefinition($scope.itemDefinition)).fail($scope.handleError);
		}

		if (foodLocalDefinitionChanged()) {
			foodDataWriter.updateFoodLocal($scope.originalItemDefinition.code, packer.packFoodLocalDefinition($scope.itemDefinition)).fail($scope.handleError);
		}

		$scope.commitParentCategories();
	}

	$scope.localDescriptionModel = function(description) {
		if (arguments.length == 1) {
			if (description.length > 0) {
				$scope.itemDefinition.localData.localDescription.defined = true;
				$scope.itemDefinition.localData.localDescription.value = description;
			} else {
				$scope.itemDefinition.localData.localDescription.defined = false;
				$scope.itemDefinition.localData.localDescription.value = null;
			}
		} else {
			if ($scope.itemDefinition != null && $scope.itemDefinition.localData.localDescription.defined)
				return $scope.itemDefinition.localData.localDescription.value;
			else
				return "";
		}
	}

	$scope.portionSizeMethodModel = function(portionSize) {
		return function(new_method_id) {
			if (arguments.length == 0) {
				return portionSize.method;
			} else {
				// Remember current parameters so that data isn't lost when user
				// switches portion size methods

				if (!portionSize.cachedParameters)
					portionSize.cachedParameters = {};

				// Ignore default undefined selection
				if (portionSize.method)
					portionSize.cachedParameters[portionSize.method] = portionSize.parameters;

				if (portionSize.cachedParameters[new_method_id])
					portionSize.parameters = portionSize.cachedParameters[new_method_id];
				else {
					// Use default parameters
					var parameters = { description : "", useForRecipes : false, imageUrl : "images/placeholder.jpg" }

					// Add method-specific default parameters if required
					switch(new_method_id) {
						case "as-served": parameters.useLeftoverImages = false; break;
						case "standard-portion": parameters.units = []; break;
						case "drink-scale": parameters.initial_fill_level = 0.9;
						case "cereal": parameters.cereal_type = "hoop";
						default: break;
					}
					portionSize.parameters = parameters;
				}
				portionSize.method = new_method_id;
			}
		}
	}

	$scope.showParentCategoriesDrawer = function() {
		$scope.$broadcast("intake24.admin.food_db.CategoryManagerDrawerOpened");
		drawers.showDrawer("drawer-manage-categories");
	}

	$scope.showAsServedImageSetDrawer = function(resultObj, resultField) {
		$scope.$broadcast("intake24.admin.food_db.AsServedSetDrawerOpened", resultObj, resultField);
		drawers.showDrawer("drawer-as-served-image-set");
	}

	$scope.showGuideImageDrawer = function(resultObj, resultField) {
		$scope.$broadcast("intake24.admin.food_db.GuideImageDrawerOpened", resultObj, resultField);
		drawers.showDrawer("drawer-guide-image");
	}

	$scope.showDrinkwareDrawer = function(resultObj, resultField) {
		$scope.$broadcast("intake24.admin.food_db.DrinkwareDrawerOpened", resultObj, resultField);
		drawers.showDrawer("drawer-drinkware");
	}

	$scope.removeItem = function(array, index) {
		array.splice(index, 1);
	}

	$scope.addPortionSize = function(array) {
		array.push({description:'', imageUrl:'', useForRecipes:false, parameters:{}});
	}

	$scope.deletePortionSize = function(array, index) {
		array.splice(index, 1);
	}

	$scope.updateCategory = function() {

		console.log("Update category");
		applyParentCategoryChanges();

		/*packCurrentItemService.broadcast();

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

		}, function errorCallback(response) { showMessage(gettext('Failed to update category'), 'danger'); console.log(response); });*/
	}

	$scope.updateLocalCategory = function() {

		applyParentCategoryChanges();

	/*	$scope.SharedData.currentItem.localData.localDescription = ($scope.SharedData.locale.intake_locale == 'en_GB') ? [$scope.SharedData.currentItem.englishDescription] : $scope.SharedData.currentItem.localData.localDescription;

		$http({
			method: 'POST',
			url: api_base_url + 'categories/' + $scope.SharedData.locale.intake_locale + '/' + $scope.SharedData.originalCode,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem.localData
		}).then(function successCallback(response) {

			showMessage(gettext('Local category updated'), 'success');

			$scope.fetchProperties();

		}, function errorCallback(response) { showMessage(gettext('Failed to update local category'), 'danger'); console.log(response); $scope.fetchProperties(); });*/
	}

	$scope.updateFood = function() {
		// These functions return a future ("promise" in angular terminology)
		// that will generate an async HTTP request to update the basic/local food
		// record if required.
		// Will return a dummy 'true' value if no changes are detected.
		// Resulting value is not important, but HTTP errors must be handled further.

		function updateLocal() {
			if ($scope.foodLocalDefinitionChanged()) {
				console.log("Local definition changed");
				var packed = packer.packFoodLocalDefinition($scope.itemDefinition.localData);
				return foodDataWriter.updateFoodLocal($scope.itemDefinition.code, packed);
			} else {
				console.log("Won't update local");
				return $q.when(true);
			}
		}

		function updateBasic() {
			if ($scope.foodBasicDefinitionChanged()) {
				console.log("Basic definition changed");
				var packed = packer.packFoodBasicDefinition($scope.itemDefinition);
				return foodDataWriter.updateFoodBasic($scope.originalItemDefinition.code, packed)
			} else {
				console.log("Won't update basic");
				return $q.when(true);
			}
		}

		// Food code might have changed.
		// Update local first (using the old code) and then basic to update the code.
		// Race conditions are possible (someone else can manage to change the code
		// between the two calls), but quite unlikely

		updateLocal().then(function (res) {
			return updateBasic();
		}).then(
			function (res) {
				showMessage(gettext('Food updated'), 'success');

				var updateEvent = {
					type: "food",
					code: $scope.itemDefinition.code;
					englishDescription: $scope.itemDefinition.englishDescription;
					localDescription: $scope.itemDefinition.localData.localDescription;
				};

				currentItem.itemUpdated(updateEvent);
			},
			function (response) {
				showMessage(gettext('Failed to update food'), 'danger');
				// Check if this was caused by a 409, and show a better message
				console.error(response);
			}
		);
	}

	$scope.updateLocalFood = function() {

		/*$scope.SharedData.currentItem.localData.localDescription = ($scope.SharedData.locale.intake_locale == 'en_GB') ? [$scope.SharedData.currentItem.englishDescription] : $scope.SharedData.currentItem.localData.localDescription;

		$http({
			method: 'POST',
			url: api_base_url + 'foods/' + $scope.SharedData.locale.intake_locale + '/' + $scope.SharedData.originalCode,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem.localData
		}).then(function successCallback(response) {

			showMessage(gettext('Local food updated'), 'success');

			$scope.fetchProperties();

		}, function errorCallback(response) { showMessage(gettext('Failed to update local food'), 'danger'); console.log(response); $scope.fetchProperties(); });*/
	}


}]);
