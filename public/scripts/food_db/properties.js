// Transform (TransformController)

angular.module('intake24.admin.food_db').controller('PropertiesController', ['$scope', '$http', 'CurrentItem', 'SharedData', 'FoodDataReader', function ($scope, $http, currentItem, sharedData, foodDataReader) {

	// Listen for boradcasts
	//packCurrentItemService.listen(function(event, data) { packCurrentItem(); });
	//unpackCurrentItemService.listen(function(event, data) { unpackCurrentItem(); });

	$scope.SharedData = sharedData;

	$scope.$on('intake24.admin.food_db.CurrentItemChanged', function(event, newItem) {
		// this is just the basic header, useful data will go to currentItemDefinition
		$scope.currentItem = newItem;
		loadProperties();
	});

	// Pack current item for server
	function packItemDefinition(unpackedItem)
	{
		var packedItem = Object();

		packedItem.code = unpackedItem.code;

		unpackedItem.update_code = true; // What's this for?

		// Ready meal option
		if (unpackedItem.overrideReadyMealOption) {
			packedItem.attributes.readyMealOption = Array(unpackedItem.booleanReadyMealOption);
		} else {
			packedItem.attributes.readyMealOption = Array();
		}

		// Same as before option
		if (unpackedItem.overrideSameAsBeforeOption) {
			packedItem.attributes.sameAsBeforeOption = Array(unpackedItem.booleanSameAsBeforeOption);
		} else {
			packedItem.attributes.sameAsBeforeOption = Array();
		}

		// Reasonable amount
		if (unpackedItem.overrideReasonableAmount) {
			packedItem.attributes.reasonableAmount = Array(unpackedItem.reasonableAmount);
		} else {
			packedItem.attributes.reasonableAmount = Array();
		}

		packedItem.localData.portionSize = packPortionSizes(unpackedItem.portionSize);
	}

	function unpackItemDefinition(packedItem)
	{
		var unpackedItem = Object();

		unpackedItem.code = packedItem.code;

		// Ready meal option
		if (packedItem.attributes.readyMealOption.length) {
			unpackedItem.overrideReadyMealOption = true;
			unpackedItem.booleanReadyMealOption = packedItem.attributes.readyMealOption[0];
		} else {
			unpackedItem.overrideReadyMealOption = false;
			unpackedItem.booleanReadyMealOption = false;
		}

		// Same as before option
		if (packedItem.attributes.sameAsBeforeOption.length) {
			unpackedItem.overrideSameAsBeforeOption = true;
			unpackedItem.booleanSameAsBeforeOption = packedItem.attributes.sameAsBeforeOption[0];
		} else {
			unpackedItem.overrideSameAsBeforeOption = false;
			unpackedItem.booleanSameAsBeforeOption = false;
		}

		// Reasonable amount
		if (packedItem.attributes.reasonableAmount.length) {
			unpackedItem.overrideReasonableAmount = true;
			unpackedItem.reasonableAmount = packedItem.attributes.reasonableAmount[0];
		} else {
			unpackedItem.overrideReasonableAmount = false;
			unpackedItem.reasonableAmount = 0;
		}

		unpackedItem.portionSize = unpackPortionSizes(packedItem.localData.portionSize);

		return unpackedItem;
	}

	function unpackPortionSizes(packedPortionSizes) {
		return $.map(packedPortionSizes, function(index, portionSize) {

			// console.log(portionSize);

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

					$scope.currentItemDefinition = unpackItemDefinition(definition);
					// fetchParentCategories('categories', $scope.SharedData.currentItem.code);

					console.log("PACKED");
					console.log(definition);
					console.log("UNPACKED");
					console.log($scope.currentItemDefinition);

					// use ng-if in template for consistency
					$('.properties-container').not('#category-properties-container').hide();
					$('#category-properties-container').css({'display':'block'});
				},
				handleError
			);
		} else if ($scope.currentItem.type == 'food') {
			foodDataReader.getFoodDefinition($scope.currentItem.code,
				function(definition) {
					$scope.currentItemDefinition = unpackItemDefinition(definition);
					//fetchParentCategories('foods', $scope.SharedData.currentItem.code);

					// use ng-if in template for consistency
					$('.properties-container').not('#food-properties-container').hide();
					$('#food-properties-container').css({'display':'block'});
				},
				handleError
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

		}, function errorCallback(response) { handleError(response); });
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

		}, function errorCallback(response) { handleError(response); });
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

		}, function errorCallback(response) { handleError(response); });
	}

	function handleError(response)
	{
		console.log(response);
		if (response.status === 401) { showMessage(gettext('You are not authorized'), 'danger'); Cookies.remove('auth-token'); }
	}

}]);
