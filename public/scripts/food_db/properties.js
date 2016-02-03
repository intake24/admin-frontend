/* Controller responsible for the property editor on the right-hand side of
* the page
*/

angular.module('intake24.admin.food_db').controller('PropertiesController', ['$scope', '$http', 'CurrentItem', 'SharedData', 'FoodDataReader', function ($scope, $http, currentItem, sharedData, foodDataReader) {

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

	$scope.$on('intake24.admin.food_db.CurrentItemChanged', function(event, newItem) {
		// This is just the basic header received from the tree control
		// Editable data will be stored in itemDefinition
		$scope.currentItem = newItem;
		loadProperties();
		loadParentCategories();
	});

	// Pack current item for server
	function packItemDefinition(unpacked)
	{
		var packed = Object();

		packed.code = unpacked.code;

		unpacked.update_code = true; // What's this for?

		// Ready meal option
		if (unpacked.overrideReadyMealOption) {
			packed.attributes.readyMealOption = Array(unpacked.booleanReadyMealOption);
		} else {
			packed.attributes.readyMealOption = Array();
		}

		// Same as before option
		if (unpacked.overrideSameAsBeforeOption) {
			packed.attributes.sameAsBeforeOption = Array(unpacked.booleanSameAsBeforeOption);
		} else {
			packed.attributes.sameAsBeforeOption = Array();
		}

		// Reasonable amount
		if (unpacked.overrideReasonableAmount) {
			packed.attributes.reasonableAmount = Array(unpacked.reasonableAmount);
		} else {
			packed.attributes.reasonableAmount = Array();
		}

		packed.localData.portionSize = packPortionSizes(unpacked.portionSize);

		return packed;
	}

	function unpackOption(option) {
		if (option.length == 1)
			return { defined: true, value: option[0] };
		else
			return { defined: false, value: null };
	}

	function packOption(option) {
		if (option.defined)
			return [option.value];
		else
			return [];
	}

	function unpackCommonDefinitionFields(packed) {
		var unpacked = Object();

		unpacked.version = packed.version;
		unpacked.code = packed.code;
		unpacked.englishDescription = packed.englishDescription;

		unpacked.attributes = Object();

		unpacked.attributes.readyMealOption = unpackOption(packed.attributes.readyMealOption);
		unpacked.attributes.sameAsBeforeOption = unpackOption(packed.attributes.sameAsBeforeOption);
		unpacked.attributes.reasonableAmount = unpackOption(packed.attributes.reasonableAmount);

		unpacked.localData = Object();

		unpacked.localData.version = unpackOption(packed.localData.version);
		unpacked.localData.localDescription = unpackOption(packed.localData.localDescription);

		unpacked.localData.portionSize = unpackPortionSizes(packed.localData.portionSize);

		return unpacked;
	}

	function unpackFoodDefinition(packed)
	{
		var unpacked = unpackCommonDefinitionFields(packed);

		unpacked.groupCode = packed.groupCode;
		unpacked.localData.nutrientTableCodes = packed.localData.nutrientTableCodes;

		return unpacked;
	}

	function unpackCategoryDefinition(packed)
	{
		var unpacked = unpackCommonDefinitionFields(packed);

		unpacked.isHidden = packed.isHidden;

		return unpacked;
	}

	function unpackCommonHeaderFields(packed)
	{
		var unpacked = Object();

		unpacked.code = packed.code;
		unpacked.englishDescription = packed.englishDescription;
		unpacked.localDescription = unpackOption(packed.localDescription);

		// Try to use local description but fall back to English if it is
		// not defined
		unpacked.displayName = unpacked.localDescription.defined ? unpacked.localDescription.value : unpacked.englishDescription;

		return unpacked;
	}

	function unpackCategoryHeader(packed)
	{
		var unpacked = unpackCommonHeaderFields(packed);
		unpacked.isHidden = packed.isHidden;
		return unpacked;
	}

	function unpackFoodHeader(packed)
	{
		return unpackCommonHeaderFields(packed);
	}

	function unpackPortionSizes(packedPortionSizes) {
		return $.map(packedPortionSizes, function(index, portionSize) {

			var unpackedPortionSize = new Object();

			unpackedPortionSize.method = portionSize.method;

			switch (portionSize.method) {

				case "standard-portion":

					unpackedPortionSize.parameters = [];

					$.each(portionSize.parameters, function(index, parameter) {

						var name = parameter.name;
						var indexArray = name.match(/\d+/);
						var index = 0;

						if (indexArray) {
							index = indexArray[0];

							if (!unpackedPortionSize.parameters[index]) { unpackedPortionSize.parameters[index] = new Object(); }

							if (parameter.name.indexOf("name") > -1) {
								unpackedPortionSize.parameters[index].name = parameter.value; // name
							} else if (parameter.name.indexOf("weight") > -1) {
								unpackedPortionSize.parameters[index].value = parameter.value; // value
							} else if (parameter.name.indexOf("omit-food-description") > -1) {
								unpackedPortionSize.parameters[index].omitFoodDescription = (parameter.value == "true") ? true : false; // omit food description
							}
						};
					})
					break;

				case "guide-image":

				unpackedPortionSize.parameters = new Object();

					$.each(portionSize.parameters, function(index, param) {
						if (param.name == 'guide-image-id') {
							unpackedPortionSize.parameters.guide_image_id = param.value;
							//$scope.setGuideImageSet(value.value, portionSize);
						}
					});

					break;

				case "as-served":

				unpackedPortionSize.parameters = new Object();

					$.each(portionSize.parameters, function(index, param) {

						if (param.name == 'serving-image-set') {
							unpackedPortionSize.parameters.serving_image_set = param.value;
						} else if (param.name == 'leftovers-image-set') {
							unpackedPortionSize.parameters.leftovers_image_set = param.value;
						}

						//$scope.setAsServedImageSet(value.value, 'serving', portionSize);

					});

					break;

				case "drink-scale":

					unpackedPortionSize.parameters = new Object();

					$.each(portionSize.parameters, function(index, param) {

						console.log(value);

						if (param.name == 'drinkware-id') {
							// $scope.setDrinkwareSet(value.value, portionSize);
						} else if (param.name == 'initial-fill-level') {
							unpackedPortionSize.parameters.initial_fill_level = value.value;
						} else if (param.name == 'skip-fill-level') {
							unpackedPortionSize.parameters.skip_fill_level = (value.value == "true") ? true : false;
						}

					});

					break;

				case "cereal":

					unpackedPortionSize.parameters = new Object();

					$.each(portionSize.parameters, function(index, param) {

						if (param.name == 'type') {
							unpackedPortionSize.parameters.cereal_type = value.value;
						}

					});

					break;

				case "milk-on-cereal":
					break;

				default:
					console.log("Other portion size method: " + portionSize.method);
					break;
			}

			return unpackedPortionSize;
		})
	}

	function packPortionSizes(unpackedPortionSizes)
	{
		return $.map(unpackedPortionSizes, function(index, portionSize) {

			var packedPortionSize = Object();

			packedPortionSize.method = portionSize.method;

			switch (portionSize.method) {

				case "standard-portion":

					packedPortionSize.parameters = [];

					packedPortionSize.parameters.push({
						name: 'units-count',
						value: portionSize.parameters.length.toString()
					});

					$.each(portionSize.parameters, function(index, parameter) {

						var name;

						name = 'unit#-name';
						packedPortionSize.parameters.push({
							name: name.replace('#', index),
							value: parameter.name.toString()
						});

						name = 'unit#-weight';
						packedPortionSize.parameters.push({
							name: name.replace('#', index),
							value: parameter.value.toString()
						});

						name = 'unit#-omit-food-description';
						packedPortionSize.parameters.push({
							name: name.replace('#', index),
							value: parameter.omitFoodDescription.toString()
						});

					})

					break;

				case "guide-image":

				// id ??
					break;

				case "as-served":

				// id??
					break;

				case "drink-scale":

					packedPortionSize.parameters = [];

					$.each(portionSize.parameters, function(key, value) {

						if (key == 'drinkware_id') {
							packedPortionSize.parameters.push({
								name: 'drinkware-id',
								value: value.toString()
							});
						}

						if (key == 'initial_fill_level') {
							packedPortionSize.parameters.push({
								name: 'initial-fill-level',
								value: value.toString()
							});
						}

						if (key == 'skip_fill_level') {
							packedPortionSize.parameters.push({
								name: 'skip-fill-level',
								value: value.toString()
							});
						}

					})

					break;

				case "cereal":

					packedPortionSize.parameters = [];

					// Update local data
					$.each(portionSize.parameters, function(key, value) {

						if (key == 'cereal_type') {
							packedPortionSize.parameters.push({
								name: 'type',
								value: value
							});
						}

					})

					break;

				case "milk-on-cereal":
					break;

				default:
					break;
			}

			return packedPortionSize;

		});
	}

	function loadProperties() {

		$('#properties-col').addClass('active');
		$('input').removeClass('valid invalid');

		if ($scope.currentItem.type == 'category') {
			foodDataReader.getCategoryDefinition($scope.currentItem.code,
				function(definition) {

					$scope.itemDefinition = unpackCategoryDefinition(definition);

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
					$scope.itemDefinition = unpackFoodDefinition(definition);

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
					$scope.currentParentCategories = $.map(categories, unpackFoodHeader);
					$scope.parentCategories = $scope.currentParentCategories;
				},
				$scope.handleError
			);
		} else if ($scope.currentItem.type == 'category') {
			foodDataReader.getCategoryParentCategories($scope.currentItem.code,
				function(categories) {
					$scope.currentParentCategories = $.map(categories, unpackCategoryHeader);
					$scope.parentCategories = $scope.currentParentCategories;
				},
				$scope.handleError
			);
		}
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

	// Export functions to child scopes

	$scope.unpackCategoryHeader = unpackCategoryHeader;

}]);
