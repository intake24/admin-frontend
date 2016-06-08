/* Controller responsible for the property editor on the right-hand side of
* the page
*/

angular.module('intake24.admin.food_db').controller('PropertiesController', ['$scope', '$http', 'CurrentItem', 'SharedData', 'FoodDataReader', 'FoodDataWriter', 'UserFoodData', 'Packer', 'Drawers', '$q', function ($scope, $http, currentItem, sharedData, foodDataReader, foodDataWriter, userFoodData, packer, drawers, $q) {

	$scope.sharedData = sharedData;

	function clearData() {
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

		// Local view of the current food/category in the current locale for debugging
		$scope.localFoodData = null;

		$scope.localFoodDataSources = null;

		$scope.localViewOpen = false;

		// Override disabled state for footer buttons, e.g. while the update async
		// request is pending
		$scope.forceDisabledButtons = false;

		// Used to select whether the new item actions are used or the update actions
		$scope.newItem = false;
	}

	clearData();

	// Currently selected item's header.
	// Used for reference and should not be changed in this controller.
	$scope.currentItem = null;

	// List of all food groups. Loaded once on controller instantiation.
	$scope.foodGroups = null;

	function reloadData() {
		clearData();

		if ($scope.currentItem) {
			disableButtons();

			$q.all(loadBasicData(), loadParentCategories(), loadLocalData()).catch(
				function(response) {
					$scope.handleError(response);
				}
			).finally(
				function() {
					enableButtons();
				}
			);
		}
	}

	$scope.$on('intake24.admin.food_db.NewItemCreated', function(event, newItem, header, parentNode) {
		$scope.currentItem = header;
		$scope.originalItemDefinition = newItem;
		$scope.itemDefinition = angular.copy(newItem);
		$scope.originalParentCategories = [];
		$scope.parentCategories = (parentNode.code == "$UNCAT") ? [] : [parentNode];
		$scope.newItem = true;
	});

	$scope.$on("intake24.admin.food_db.CloneItem", function(event, parentNode) {

	});

	$scope.$on('intake24.admin.food_db.CurrentItemChanged', function(event, newItem) {
		// This is just the basic header received from the tree control
		// Editable data will be stored in itemDefinition
		$scope.currentItem = newItem;
		$scope.newItem = false;
		reloadData();
	});

	$scope.$on('intake24.admin.food_db.CurrentItemUpdated', function(event, updateEvent) {
		$scope.currentItem = updateEvent.header;
		reloadData();
	});

	$scope.$on("intake24.admin.LoggedIn", function(event) {
		reloadFoodGroups();
	})

	$scope.$watch("itemChanged()", function(event) {
		currentItem.setChangedState($scope.itemChanged());
	});

	function loadBasicData() {

		function resetStyles() {
			$('#properties-col').addClass('active');
			$('input').removeClass('valid invalid');
		}

		if ($scope.currentItem.type == 'category') {
			return foodDataReader.getCategoryDefinition($scope.currentItem.code).then(
				function(definition) {
					$scope.itemDefinition = packer.unpackCategoryDefinition(definition);
					$scope.originalItemDefinition = angular.copy($scope.itemDefinition);

					resetStyles();
				});
		} else if ($scope.currentItem.type == 'food') {
			return foodDataReader.getFoodDefinition($scope.currentItem.code).then(
				function(definition) {
					$scope.itemDefinition = packer.unpackFoodDefinition(definition);
					$scope.originalItemDefinition = angular.copy($scope.itemDefinition);

					resetStyles();
				});
		}
	}

	function loadParentCategories() {

		function unpackCategories(categories) {
			$scope.parentCategories = $.map(categories, packer.unpackCategoryHeader);
			$scope.originalParentCategories = angular.copy($scope.parentCategories);
		}

		if ($scope.currentItem.type == 'food')
			return foodDataReader.getFoodParentCategories($scope.currentItem.code).then(unpackCategories);
		else if ($scope.currentItem.type == 'category')
			return foodDataReader.getCategoryParentCategories($scope.currentItem.code).then(unpackCategories);
	}

	function loadLocalData() {
		if ($scope.currentItem.type == 'food') {
			return userFoodData.getFoodDataWithSources($scope.currentItem.code).then(
				function(data) {
					$scope.localFoodData = data[0];
					$scope.localFoodDataSources = data[1];
				},
				function(response) {
					if (response.code == 404) {
						// 404 is expected and means that local food data is not defined
						$scope.localFoodData = null;
					} // anything else is an error
						else return $q.reject(response);
				});
		}
	}

	function reloadFoodGroups() {
		foodDataReader.getFoodGroups().then(
			function(groups) {
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

	$scope.checkCode = function($event)
	{
		var el = $($event.target);
		var code = el.val();

		if (code.length < 4 || code == $scope.originalItemDefinition.code) { el.removeClass('valid invalid'); return; }

		var deferred = ($scope.currentItem.type == 'food') ? foodDataWriter.checkFoodCode(code) : foodDataWriter.checkCategoryCode(code);

		deferred.then(
			function (codeValid) {
				if (codeValid)
					el.removeClass('invalid').addClass('valid');
				else
					el.removeClass('valid').addClass('invalid');
			},
			$scope.handleError);

	}

	function disableButtons() {
		$scope.forceDisabledButtons = true;
	}

	function enableButtons() {
		$scope.forceDisabledButtons = false;
	}

	$scope.parentCategoriesChanged = function() {
		var changes = parentCategoryChanges();
		return ((changes.add_to.length + changes.remove_from.length) > 0);
	}

	// Returns a single deferred for all the necessary category calls
	function updateParentCategories() {
		var changes = parentCategoryChanges();

		var addRequests = $.map(changes.add_to, function (c) {
			if ($scope.currentItem.type == 'food')
				return foodDataWriter.addFoodToCategory(c.code, $scope.itemDefinition.code);
			else if ($scope.currentItem.type == 'category')
				return foodDataWriter.addCategoryToCategory(c.code, $scope.itemDefinition.code);
		});

		var deleteRequests = $.map(changes.remove_from, function (c) {
			if ($scope.currentItem.type == 'food')
				return foodDataWriter.removeFoodFromCategory(c.code, $scope.itemDefinition.code);
			else if ($scope.currentItem.type == 'category')
				return foodDataWriter.removeCategoryFromCategory(c.code, $scope.itemDefinition.code);
		});

		// $q.all is sequence: Array[Future[_]] => Future[Array[_]]
		return $q.all(addRequests.concat(deleteRequests));
	}

	$scope.categoryBasicDefinitionChanged = function() {
		if ($scope.originalItemDefinition && $scope.itemDefinition)
			return !angular.equals(packer.packCategoryBasicDefinition($scope.originalItemDefinition), packer.packCategoryBasicDefinition($scope.itemDefinition));
		else
			return false;
	}

	$scope.categoryLocalDefinitionChanged = function() {
		if ($scope.originalItemDefinition && $scope.itemDefinition)
			return !angular.equals(packer.packCategoryLocalDefinition($scope.originalItemDefinition.localData), packer.packCategoryLocalDefinition($scope.itemDefinition.localData));
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
		if ($scope.newItem)
			return false;
		else if ($scope.currentItem) {
				if ($scope.currentItem.type == 'food')
					return $scope.foodChanged();
				else if ($scope.currentItem.type == 'category')
					return $scope.categoryChanged();
			} else
				return false;
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
		array.push({method: 'as-served', description:'', imageUrl:'', useForRecipes:false, parameters:{}});
	}

	$scope.deletePortionSize = function(array, index) {
		array.splice(index, 1);
	}

	$scope.updateCategory = function() {
		disableButtons();

		updateCategoryBase()
			.then(function () {	return updateParentCategories(); })
			.then(function () {	return updateCategoryLocal(); })
			.then(
				function () {
						showMessage(gettext('Category updated'), 'success');
						notifyItemUpdated();
					},
				function (response) {
					showMessage(gettext('Failed to update category'), 'danger');
					// Check if this was caused by a 409, and show a better message
					console.error(response);

					notifyItemUpdated();
				});
	}

	function createUpdateEvent() {
		return {
			header: {
				type: $scope.currentItem.type,
				code: $scope.itemDefinition.code,
				englishDescription: $scope.itemDefinition.englishDescription,
				localDescription: $scope.itemDefinition.localData.localDescription,
				displayName: $scope.itemDefinition.localData.localDescription.defined ? $scope.itemDefinition.localData.localDescription.value : $scope.itemDefinition.englishDescription
			},
			originalCode: $scope.originalItemDefinition.code,
			parentCategories: $.map($scope.parentCategories, function( cat ) { return cat.code; }),
		};
	}

	function notifyItemUpdated() {
		var updateEvent = createUpdateEvent();
		updateEvent.newItem = $scope.newItem;
		currentItem.itemUpdated(updateEvent);
	}

	// These functions return a future/promise/deferred (see https://docs.angularjs.org/api/ng/service/$q)
	// that will generate an async HTTP request to update the basic/local food
	// record if required.
	// Will return a dummy 'true' value if no changes are detected.
	// Resulting value is not important, but HTTP errors must be handled further.

	function updateFoodBase() {
		if ($scope.foodBasicDefinitionChanged()) {
			var packed = packer.packFoodBasicDefinition($scope.itemDefinition);
			return foodDataWriter.updateFoodBase($scope.originalItemDefinition.code, packed)
		} else {
			return $q.when(true);
		}
	}

	function updateFoodLocal() {
		if ($scope.foodLocalDefinitionChanged()) {
			var packed = packer.packFoodLocalDefinition($scope.itemDefinition.localData);
			return foodDataWriter.updateFoodLocal($scope.itemDefinition.code, packed);
		} else {
			return $q.when(true);
		}
	}

	function updateCategoryBase() {
		if ($scope.categoryBasicDefinitionChanged()) {
			var packed = packer.packCategoryBasicDefinition($scope.itemDefinition);
			return foodDataWriter.updateCategoryBase($scope.originalItemDefinition.code, packed)
		} else {
			return $q.when(true);
		}
	}

	function updateCategoryLocal() {
		if ($scope.categoryLocalDefinitionChanged()) {
			var packed = packer.packCategoryLocalDefinition($scope.itemDefinition.localData);
			return foodDataWriter.updateCategoryLocal($scope.itemDefinition.code, packed);
		} else {
			return $q.when(true);
		}
	}

	$scope.updateFood = function() {
		disableButtons();

		updateFoodBase()
			.then(function () {	return updateParentCategories(); })
			.then(function () {	return updateFoodLocal(); })
			.then(
				function () {
						showMessage(gettext('Food updated'), 'success');
						notifyItemUpdated();
					},
				function (response) {
					showMessage(gettext('Failed to update food'), 'danger');
					// Check if this was caused by a 409, and show a better message
					console.error(response);

					notifyItemUpdated();
				});
	}

	$scope.discardFoodChanges = function() {
		reloadData();
		showMessage(gettext('Changes discarded'), 'success');
	}

	$scope.saveNewFood = function() {
		var packed = packer.packNewFoodDefinition($scope.itemDefinition);

		// FIXME: this really needs better error handling when the base record
		// is able to be created, but the parent categories then fail to update

		foodDataWriter.createNewFood(packed)
			.then( function () { return updateParentCategories(); })
			.then( function () {
				showMessage(gettext('New food added'), 'success');
				notifyItemUpdated();
			}, function (response) {
				showMessage(gettext('Failed to add new food'), 'danger');
				// Check if this was caused by a 409, and show a better message
				console.error(response);
			});
	}

	$scope.cancelNewFood = function() {
		currentItem.setCurrentItem(null);
	}

	$scope.saveNewCategory = function() {
		var packed = packer.packNewCategoryDefinition($scope.itemDefinition);

		// FIXME: this really needs better error handling when the base record
		// is able to be created, but the parent categories then fail to update

		foodDataWriter.createNewCategory(packed)
			.then( function () { return updateParentCategories(); })
			.then( function () {
				showMessage(gettext('New category added'), 'success');
				notifyItemUpdated();
			}, function (response) {
				showMessage(gettext('Failed to add new category'), 'danger');
				// Check if this was caused by a 409, and show a better message
				console.error(response);
			});
	}

	$scope.cancelNewCategory = function() {
		currentItem.setCurrentItem(null);
	}

	$scope.deleteItem = function() {
		currentItem.delete();
	}

}]);
