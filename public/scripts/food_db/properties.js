/* Controller responsible for the property editor on the right-hand side of
* the page
*/

angular.module('intake24.admin.food_db').controller('PropertiesController', ['$scope', '$http', 'CurrentItem', 'SharedData', 'FoodDataReader', 'Packer', 'Drawers', function ($scope, $http, currentItem, sharedData, foodDataReader, packer, drawers) {

	$scope.sharedData = sharedData;

	// Currently selected item's header
	// Used for reference and should not be changed in this controller
	$scope.currentItem = null;

	// Current state of the selected item's properties
	// Loaded from the server when the currentItem changes,
	// then bound to page controls and can be edited
	$scope.itemDefinition = null;

  // A snapshot of the initial parent categories state
	// Loaded from the server when the currentItem changes
	// Used to generate add/remove category API calls when the item is saved
	$scope.currentParentCategories = null;

	// Current state of the selected item's parent categories list
	// Can be edited using the "Manage categories" drawer
	$scope.parentCategories = null;

	// List of all food groups. Loaded once on controller instantiation.
	$scope.foodGroups = null;

	$scope.$on('intake24.admin.food_db.CurrentItemChanged', function(event, newItem) {
		// This is just the basic header received from the tree control
		// Editable data will be stored in itemDefinition
		$scope.currentItem = newItem;
		loadProperties();
		loadParentCategories();
	});

	function loadProperties() {

		$('#properties-col').addClass('active');
		$('input').removeClass('valid invalid');

		if ($scope.currentItem.type == 'category') {
			foodDataReader.getCategoryDefinition($scope.currentItem.code,
				function(definition) {
					$scope.itemDefinition = packer.unpackCategoryDefinition(definition);

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
					$scope.currentParentCategories = $.map(categories, packer.unpackFoodHeader);
					$scope.parentCategories = $scope.currentParentCategories;
				},
				$scope.handleError
			);
		} else if ($scope.currentItem.type == 'category') {
			foodDataReader.getCategoryParentCategories($scope.currentItem.code,
				function(categories) {
					$scope.currentParentCategories = $.map(categories, packer.unpackCategoryHeader);
					$scope.parentCategories = $scope.currentParentCategories;
				},
				$scope.handleError
			);
		}
	}

	function reloadFoodGroups() {
		foodDataReader.getFoodGroups(function(groups) {
			$scope.foodGroups = $.map(groups, packer.unpackFoodGroup);
		},
		$scope.handleError);
	}

	$scope.setGuideImageSet = function(id, portionSize) {

		$http({
			method: 'GET',
			url: api_base_url + 'portion-size/guide-image/' + id,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			portionSize.selected_guide_image_set = response.data;

			var found = false;

			$.each(portionSize.parameters, function(index, value) {

				if (value.name == 'guide-image-id') { value.value = response.data.id; found = true; }

			});

			if (!found) { portionSize.parameters.push({name: 'guide-image-id', value: response.data.id}); };

			hideDrawer();

		}, function errorCallback(response) { $scope.handleError(response); });
	}

	$scope.setDrinkwareSet = function(id, portionSize) {

		$http({
			method: 'GET',
			url: api_base_url + 'portion-size/drinkware/' + id,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			portionSize.selected_drinkware_image_set = response.data;

			portionSize.temp.parameters.drinkware_id = response.data.id;

			hideDrawer();

		}, function errorCallback(response) { $scope.handleError(response); });
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
		$scope.$broadcast("intake24.admin.food_db.AsServedSetDrawerOpened", resultObj, resultField)
		drawers.showDrawer("drawer-as-served-image-set");
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

	reloadFoodGroups();

}]);
