// Transform (TransformController)

app.controller('TransformController', function($scope, $http, packCurrentItemService, unpackCurrentItemService, SharedData) {

	// Listen for boradcasts
	packCurrentItemService.listen(function(event, data) { packCurrentItem(); });
	unpackCurrentItemService.listen(function(event, data) { unpackCurrentItem(); });
	
	// Load shared data
	$scope.SharedData = SharedData;

	// Pack current item for server
	function packCurrentItem()
	{
		$scope.SharedData.currentItem.code = $scope.SharedData.currentItem.temp.code;

		$scope.SharedData.currentItem.temp.update_code = true;

		$scope.SharedData.currentItem.attributes.readyMealOption = ($scope.SharedData.currentItem.temp.booleanReadyMealOption) ? Array(true) : Array();
		$scope.SharedData.currentItem.attributes.sameAsBeforeOption = ($scope.SharedData.currentItem.temp.booleanSameAsBeforeOption) ? Array(true) : Array();

		packPortionSizes();
	}

	// Unpack current item for angular
	function unpackCurrentItem()
	{
		$scope.SharedData.currentItem.temp = Object();
		$scope.SharedData.currentItem.temp.code = $scope.SharedData.currentItem.code;
		$scope.SharedData.currentItem.temp.booleanReadyMealOption = ($scope.SharedData.currentItem.attributes.readyMealOption.length) ? true : false;
		$scope.SharedData.currentItem.temp.booleanSameAsBeforeOption = ($scope.SharedData.currentItem.attributes.sameAsBeforeOption.length) ? true : false;

		// Portion sizes
		$.each($scope.SharedData.currentItem.localData.portionSize, function(index, portionSize) {

			console.log(portionSize);
			
			portionSize.temp = new Object();
			
			switch (portionSize.method) {

				case "standard-portion":
					
					portionSize.temp.parameters = [];

					$.each(portionSize.parameters, function(index, parameter) {
						
						var name = parameter.name;
						var indexArray = name.match(/\d+/);
						var index = 0;

						if (indexArray) {
							index = indexArray[0];

							if (!portionSize.temp.parameters[index]) { portionSize.temp.parameters[index] = new Object(); }

							if (parameter.name.indexOf("name") > -1) {
								portionSize.temp.parameters[index].name = parameter.value; // name
							} else if (parameter.name.indexOf("weight") > -1) {
								portionSize.temp.parameters[index].value = parameter.value; // value
							} else if (parameter.name.indexOf("omit-food-description") > -1) {
								portionSize.temp.parameters[index].omitFoodDescription = (parameter.value == "true") ? true : false; // omit food description
							}
						};
					})
					break;

				case "guide-image":

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'guide-image-id') {
							$scope.setGuideImageSet(value.value, portionSize);
						}

					});

					break;

				case "as-served":

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'serving-image-set') {
							$scope.setAsServedImageSet(value.value, 'serving', portionSize);
						}

						if (value.name == 'leftovers-image-set') {
							$scope.setAsServedImageSet(value.value, 'leftovers', portionSize);
						}

					});

					break;

				case "drink-scale":

					portionSize.temp.parameters = new Object();

					$.each(portionSize.parameters, function(index, value) {

						console.log(value);

						if (value.name == 'drinkware-id') {
							$scope.setDrinkwareSet(value.value, portionSize);
						}

						if (value.name == 'initial-fill-level') {
							portionSize.temp.parameters.initial_fill_level = value.value;
						}

						if (value.name == 'skip-fill-level') {
							portionSize.temp.parameters.skip_fill_level = (value.value == "true") ? true : false;
						}
						
					});

					break;

				case "cereal":

					portionSize.temp.parameters = new Object();

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'type') {
							portionSize.temp.parameters.cereal_type = value.value;
						}
						
					});

					break;

				case "milk-on-cereal":
					break;

				default:
					console.log("Other portion size method: " + portionSize.method);
					break;
			}
		})
	}

	function packPortionSizes()
	{
		// Portion sizes
		$.each($scope.SharedData.currentItem.localData.portionSize, function(index, portionSize) {
			
			switch (portionSize.method) {

				case "standard-portion":

					portionSize.parameters = [];

					portionSize.parameters.push({
						name: 'units-count',
						value: portionSize.temp.parameters.length.toString()
					});

					// Update local data
					$.each(portionSize.temp.parameters, function(index, parameter) {
						
						var name;

						name = 'unit#-name';
						portionSize.parameters.push({
							name: name.replace('#', index),
							value: parameter.name.toString()
						});

						name = 'unit#-weight';
						portionSize.parameters.push({
							name: name.replace('#', index),
							value: parameter.value.toString()
						});

						name = 'unit#-omit-food-description';
						portionSize.parameters.push({
							name: name.replace('#', index),
							value: parameter.omitFoodDescription.toString()
						});

					})

					break;

				case "guide-image":
					break;

				case "as-served":
					break;

				case "drink-scale":

					portionSize.parameters = [];

					// Update local data
					$.each(portionSize.temp.parameters, function(key, value) {

						if (key == 'drinkware_id') {
							portionSize.parameters.push({
								name: 'drinkware-id',
								value: value.toString()
							});	
						}

						if (key == 'initial_fill_level') {
							portionSize.parameters.push({
								name: 'initial-fill-level',
								value: value.toString()
							});	
						}

						if (key == 'skip_fill_level') {
							portionSize.parameters.push({
								name: 'skip-fill-level',
								value: value.toString()
							});	
						}
						
					})

					break;

				case "cereal":

					portionSize.parameters = [];

					// Update local data
					$.each(portionSize.temp.parameters, function(key, value) {

						if (key == 'cereal_type') {
							portionSize.parameters.push({
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
		
		});
		
		// Remove temp parameters
		delete portionSize.temp;
		delete portionSize.$$hashKey;
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

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'serving-image-set') { value.value = response.data.id; }

					});
					
					break;

				case 'leftovers':
					portionSize.selected_leftovers_image_set = response.data;

					$.each(portionSize.parameters, function(index, value) {

						if (value.name == 'leftovers-image-set') { value.value = response.data.id; }

					});
					
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

			$.each(portionSize.parameters, function(index, value) {

				if (value.name == 'guide-image-id') { value.value = response.data.id; }

			});

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

});