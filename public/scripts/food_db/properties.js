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

	$scope.$on('intake24.admin.food_db.CurrentItemChanged', function(event, newItem) {
		// This is just the basic header received from the tree control
		// Editable data will be stored in itemDefinition
		$scope.currentItem = newItem;
		reloadData();
	});

	$scope.$on('intake24.admin.food_db.CurrentItemUpdated', function(event, updateEvent) {
		$scope.currentItem = updateEvent.header;
		reloadData();
	});

	$scope.$on('intake24.admin.food_db.PropertiesLoaded', function(event) {
		$('.input-intake-code').keyup(function() { checkCode(this); } );
	});

	$scope.$on("intake24.admin.LoggedIn", function(event) {
		reloadFoodGroups();
	})

	$scope.$watch("itemChanged()", function(event) {
		currentItem.setChangedState($scope.itemChanged());
	});

	function loadBasicData() {

		function broadcastEvent() {
			$scope.$broadcast('intake24.admin.food_db.PropertiesLoaded');
		}

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
					broadcastEvent();
				});
		} else if ($scope.currentItem.type == 'food') {
			return foodDataReader.getFoodDefinition($scope.currentItem.code).then(
				function(definition) {
					$scope.itemDefinition = packer.unpackFoodDefinition(definition);
					$scope.originalItemDefinition = angular.copy($scope.itemDefinition);

					resetStyles();
					broadcastEvent();

				});
		}
	}

	function loadParentCategories() {
		if ($scope.currentItem.type == 'food') {
			return foodDataReader.getFoodParentCategories($scope.currentItem.code).then(
				function(categories) {
					$scope.parentCategories = $.map(categories, packer.unpackFoodHeader);
					$scope.originalParentCategories = angular.copy($scope.parentCategories);
				}
			);
		} else if ($scope.currentItem.type == 'category') {
			return foodDataReader.getCategoryParentCategories($scope.currentItem.code).then(
				function(categories) {
					$scope.parentCategories = $.map(categories, packer.unpackCategoryHeader);
					$scope.originalParentCategories = angular.copy($scope.parentCategories);
				});
		}
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

	function checkCode(input)
	{
		var code = $(input).val();

		if (code.length < 4 || code == $scope.originalItemDefinition.code) { $(input).removeClass('valid invalid'); return; }

		var future = ($scope.currentItem.type == 'food') ? foodDataWriter.checkFoodCode(code) : foodDataWriter.checkCategoryCode(code);

		future.then(
			function onSuccess(response) {
				if (response.data) {
					$(input).removeClass('invalid').addClass('valid');
				} else {
					$(input).removeClass('valid').addClass('invalid');
				}
			},
			function onError(response) {
				$scope.handleError(response);
		});
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

	// Returns a single future (promise) for all the necessary category calls
	function updateParentCategories() {
		var changes = parentCategoryChanges();

		// The requests below are using the original item code because the code
		// could have been edited. Category changes must therefore be applied
		// before base food/category record updates.

		var addRequests = $.map(changes.add_to, function (c) {
			if ($scope.currentItem.type == 'food')
				return foodDataWriter.addFoodToCategory($scope.originalItemDefinition.code, c.code);
			else if ($scope.currentItem.type == 'category')
				return foodDataWriter.addCategoryToCategory($scope.originalItemDefinition.code, c.code);
		});

		var deleteRequests = $.map(changes.remove_from, function (c) {
			if ($scope.currentItem.type == 'food')
				return foodDataWriter.removeFoodFromCategory($scope.originalItemDefinition.code, c.code);
			else if ($scope.currentItem.type == 'category')
				return foodDataWriter.removeCategoryFromCategory($scope.originalItemDefinition.code, c.code);
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
		if ($scope.currentItem && $scope.currentItem.type == 'food')
			return $scope.foodChanged();
		else if ($scope.currentItem && $scope.currentItem.type == 'category')
			return $scope.categoryChanged();
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

		function updateLocalDeferred() {
			if ($scope.categoryLocalDefinitionChanged()) {
				var packed = packer.packCategoryLocalDefinition($scope.itemDefinition.localData);
				return foodDataWriter.updateCategoryLocal($scope.itemDefinition.code, packed);
			} else {
				return $q.when(true);
			}
		}

		function updateBasicDeferred() {
			if ($scope.categoryBasicDefinitionChanged()) {
				var packed = packer.packCategoryBasicDefinition($scope.itemDefinition);
				return foodDataWriter.updateCategoryBase($scope.originalItemDefinition.code, packed)
			} else {
				return $q.when(true);
			}
		}

		updateParentCategories().then(function (response) {
			return updateLocalDeferred();
		}).then(
			function (response) {
				return updateBasicDeferred();
		}).then(
			function (response) {
				showMessage(gettext('Category updated'), 'success');

				var updateEvent = {
					header: {
						type: "category",
						code: $scope.itemDefinition.code,
						englishDescription: $scope.itemDefinition.englishDescription,
						localDescription: $scope.itemDefinition.localData.localDescription,
						displayName: $scope.itemDefinition.localData.localDescription.defined ? $scope.itemDefinition.localData.localDescription.value : $scope.itemDefinition.englishDescription
					},
					originalCode: $scope.originalItemDefinition.code,
					parentCategories: $.map($scope.parentCategories, function( cat ) { return cat.code; }),
				};

				currentItem.itemUpdated(updateEvent);
			},
			function (response) {
				showMessage(gettext('Failed to update category'), 'danger');
				// Check if this was caused by a 409, and show a better message
				console.error(response);

				currentItem.itemUpdated(updateEvent);
			}
		);
	}

	$scope.updateFood = function() {

		disableButtons();

		// These functions return a future ("promise" in angular terminology)
		// that will generate an async HTTP request to update the basic/local food
		// record if required.
		// Will return a dummy 'true' value if no changes are detected.
		// Resulting value is not important, but HTTP errors must be handled further.

		function updateLocal() {
			if ($scope.foodLocalDefinitionChanged()) {
				var packed = packer.packFoodLocalDefinition($scope.itemDefinition.localData);
				return foodDataWriter.updateFoodLocal($scope.itemDefinition.code, packed);
			} else {
				return $q.when(true);
			}
		}

		function updateBasic() {
			if ($scope.foodBasicDefinitionChanged()) {
				var packed = packer.packFoodBasicDefinition($scope.itemDefinition);
				return foodDataWriter.updateFoodBase($scope.originalItemDefinition.code, packed)
			} else {
				return $q.when(true);
			}
		}

		// Food code might have changed.
		// Update parent categories first, then local record (using the old code)
		// and then basic to update the code.
		// Race conditions are possible (someone else can manage to change the code
		// between the two calls), but quite unlikely.

		updateParentCategories().then(function (response) {
			return updateLocal();
		}).then(
			function (response) {
				return updateBasic();
		}).then(
			function (response) {
				showMessage(gettext('Food updated'), 'success');

				var updateEvent = {
					header: {
						type: "food",
						code: $scope.itemDefinition.code,
						englishDescription: $scope.itemDefinition.englishDescription,
						localDescription: $scope.itemDefinition.localData.localDescription,
						displayName: $scope.itemDefinition.localData.localDescription.defined ? $scope.itemDefinition.localData.localDescription.value : $scope.itemDefinition.englishDescription
					},
					originalCode: $scope.originalItemDefinition.code,
					parentCategories: $.map($scope.parentCategories, function( cat ) { return cat.code; }),
				};

				currentItem.itemUpdated(updateEvent);
			},
			function (response) {
				showMessage(gettext('Failed to update food'), 'danger');
				// Check if this was caused by a 409, and show a better message
				console.error(response);

				currentItem.itemUpdated(updateEvent);
			}
		);
	}

	$scope.discardFoodChanges = function() {
		reloadData();
		showMessage(gettext('Changes discarded'), 'success');
	}
}]);
