/* Controller responsible for the property editor on the right-hand side of
* the page
*/

angular.module('intake24.admin.food_db').controller('PropertiesController', ['$scope', '$http', 'CurrentItem', 'SharedData', 'FoodDataReader', 'Packer', function ($scope, $http, currentItem, sharedData, foodDataReader, packer) {

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

	// Food groups list. Loaded once on controller instantiation.
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

					/* console.log("PACKED");
					console.log(definition);
					console.log("UNPACKED");
					console.log($scope.itemDefinition);*/

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

	$scope.setAsServedImageSet = function(id, type, portionSize) {

		$http({
			method: 'GET',
			url: api_base_url + 'portion-size/as-served/' + id,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			switch (type) {

				case 'serving':
					portionSize.selected_serving_image_set = response.data;

					var found = false;

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'serving-image-set') { value.value = response.data.id; found = true; }

					});

					if (!found) { portionSize.parameters.push({name: 'serving-image-set', value: response.data.id}); };

					break;

				case 'leftovers':
					portionSize.selected_leftovers_image_set = response.data;

					var found = false;

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'leftovers-image-set') { value.value = response.data.id; found = true; }

					});

					if (!found) { portionSize.parameters.push({name: 'leftovers-image-set', value: response.data.id}); };

					break;
			}

			hideDrawer();

		}, function errorCallback(response) { $scope.handleError(response); });
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

	$scope.localDescriptionGetOrSet = function(description) {
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

	reloadFoodGroups();

}]);
