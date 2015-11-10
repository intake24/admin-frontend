// Explorer (ExplorerController)

app.controller('ExplorerController', function($scope, $http, expandPropertiesService, fetchCategoriesService, SharedData) {

	// Listen for boradcasts
	fetchCategoriesService.listen(function(event, data) { fetchCategories(); });
	
	// Init object to store food
	$scope.items = new Object();
	$scope.SharedData = SharedData;

	// When adding a food
	$scope.newFood = new Object();

	$scope.loading_uncategorized = false;

	function showContainer(container_id) {
		$('.properties-container').hide();
		$(container_id).show();
	}

	// Check if codes available
	$('input').keyup(function() {
		if ($(this).attr('id') == 'input-food-code') { checkCode(this, 'foods'); }
		if ($(this).attr('id') == 'input-category-code') { checkCode(this, 'categories'); }
	});
	
	$('#add-food-to-category-btn').click(function() {
		showModal('modal-add-food-to-category');
	});

	$('#button-add-food-to-category').click(function() {
		$.each($scope.SharedData.allCategories, function(index, value) {
			if (value.isParentCategory) {
				addFoodToCategory($scope.SharedData.currentItem.code, value.code);
			};
		});
	});

	$('#remove-food-from-category-btn').click(function() {

		$.each($scope.SharedData.currentItem.parentCategories, function(index, value) {

			if (value.remove) {

				// Item is flagged for removal so lets remove it!
				var food_code = $scope.SharedData.currentItem.code;
				var category_code = value.code;

				$http({
					method: 'DELETE',
					url: api_base_url + 'categories/' + category_code + '/foods/' + food_code,
					headers: { 'X-Auth-Token': Cookies.get('auth-token') }
				}).then(function successCallback(response) {

					showMessage('Removed from categories', 'success');
					loadItem('food', $scope.SharedData.currentItem.code, $scope.SharedData.currentItem.code);

				}, function errorCallback(response) { showMessage('Failed to remove from categories', 'danger'); });
			};
		});
	});

	function deleteNode(code)
	{
		$('#food-list').jstree().delete_node($('#' + code));
	}

	function resetProperties()
	{
		$('.properties-container').hide();
		$scope.SharedData.currentItem = new Object();
		$('input').removeClass('valid invalid');
	}

	function hasWhiteSpace(s) {
	  return s.indexOf(' ') >= 0;
	}

	function fetchCategories()
	{
		resetProperties();

		$http({
			method: 'GET',
			url: api_base_url + 'categories/' + locale,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$.each(response.data, function(index, value) {
				value.type = 'category';
				$scope.SharedData.treeData[value.code] = value;
			})

			fetchFoodGroups();

		}, function errorCallback(response) { handleError(response); });
	}

	$scope.nodeSelected = function($event, value) {

		SharedData.currentItem = value; 

		$scope.SharedData.originalCode = value.code;

		$($event.target).parent().toggleClass('node-open');

		$scope.getChildren($event, value);
	}

	$scope.getProperties = function($event, value) {

		$('#properties-col').addClass('active');
		$('input').removeClass('valid invalid');

		var api_endpoint = ($scope.SharedData.currentItem.type == 'category') ? api_base_url + 'categories/' + locale + '/' + value.code + '/definition' : api_base_url + 'foods/' + locale + '/' + value.code + '/definition';

		$('#food-properties-container').hide();
		$('#category-properties-container').hide();

		$http({
			method: 'GET',
			url: api_endpoint,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			response.data.type = $scope.SharedData.currentItem.type;

			$scope.SharedData.currentItem = response.data;
			
			$scope.SharedData.currentItem.attributes.booleanReadyMealOption = ($scope.SharedData.currentItem.attributes.readyMealOption.length) ? true : false;
			$scope.SharedData.currentItem.attributes.booleanSameAsBeforeOption = ($scope.SharedData.currentItem.attributes.sameAsBeforeOption.length) ? true : false;

			console.log($scope.SharedData.currentItem.type);

			if ($scope.SharedData.currentItem.type == 'category') {

				fetchParentCategories('categories', value.code);
				$('#category-properties-container').show();

			} else {

				$scope.SharedData.selectedFoodGroup = $scope.SharedData.foodGroups[response.data.groupCode];

				$('#food-properties-container').show();
				fetchParentCategories('foods', value.code);
			}
			
		}, function errorCallback(response) { handleError(response); });
	}
	
	$scope.getChildren = function($event, value) {

		$http({
			method: 'GET',
			url: api_base_url + 'categories/' + locale + '/' + value.code,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$.each(response.data.subcategories, function(index, value) { value.type = 'category'; })

			$.each(response.data.foods, function(index, value) { value.type = 'food'; })

			var children = response.data.subcategories.concat(response.data.foods);

			$scope.SharedData.currentItem.children = children;

			$scope.getProperties($event, value);
		});
	}

	function fetchFoodGroups()
	{
		$http({
			method: 'GET',
			url: api_base_url + 'food-groups/' + locale,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$scope.SharedData.foodGroups = response.data;

		}, function errorCallback(response) { handleError(response); });
	}

	function fetchParentCategories(type, item_code)
	{
		$http({
			method: 'GET',
			url: api_base_url + type + '/en/' + item_code + '/parent-categories',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(function successCallback(response) {

			$.each(response.data, function(index, value) {
				value.remove = false;
			});
			
			$scope.SharedData.currentItem.parentCategories = response.data;

		}, function errorCallback(response) { handleError(response); });		
	}

	function addNode(node_id, parent_id, index, value, type)
	{
		node_id += '_' + parent_id.replace('#','');

		if (value.isHidden)
			return;

		if ($('#' + node_id).length > 0) {
			console.log('Node exists with this id');
			return;
		}

		$('#food-list').jstree().create_node(parent_id, { "id" : node_id, "index" : index, "data" : { "type" : type }, "text" : value.englishDescription}, "last", function() {
			$scope.items[node_id] = value; });
	}

	function setAttributes()
	{
		$scope.SharedData.currentItem.attributes.readyMealOption = ($scope.SharedData.currentItem.attributes.booleanReadyMealOption) ? Array(true) : Array();
		$scope.SharedData.currentItem.attributes.sameAsBeforeOption = ($scope.SharedData.currentItem.attributes.booleanSameAsBeforeOption) ? Array(true) : Array();
	}

	// Food Actions

	$scope.addFood = function() {

		setAttributes();

		delete $scope.SharedData.currentItem.version;
		
		$scope.SharedData.currentItem.groupCode = $scope.SharedData.selectedFoodGroup.id;
		
		$http({
			method: 'POST',
			url: api_base_url + 'foods/new',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem
		}).then(function successCallback(response) {

			showMessage('Food added', 'success');
			$scope.SharedData.currentItem = new Object();
			$('input').removeClass('valid invalid');

		}, function errorCallback(response) { showMessage('Failed to add food', 'danger'); console.log(response); });
	}

	$scope.discardFoodChanges = function() {
	
		loadItem('food', $scope.SharedData.currentItem.code, $scope.SharedData.currentItem.code);
	}

	$scope.deleteFood = function() {
		if (confirm("Delete " + $scope.SharedData.currentItem.code + "?"))
		{
			var food_code = $scope.SharedData.currentItem.code;

			$http({
				method: 'DELETE',
				url: api_base_url + 'foods/' + food_code,
				headers: { 'X-Auth-Token': Cookies.get('auth-token') }
			}).then(function successCallback(response) {

				showMessage('Food deleted', 'success');
				
				deleteNode($scope.SharedData.currentItem.code);
				resetProperties();

			}, function errorCallback(response) { showMessage('Failed to delete food', 'danger'); });
		}
	}

	$scope.updateFood = function() {

		setAttributes();

		$scope.SharedData.currentItem.groupCode = $scope.SharedData.selectedFoodGroup.id;
		
		$http({
			method: 'POST',
			url: api_base_url + 'foods/' + $scope.SharedData.originalCode,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem
		}).then(function successCallback(response) {

			showMessage('Food updated', 'success');

			var parent_id = $('#' + $scope.SharedData.originalCode).parent().parent().first().attr('id');
			
			deleteNode($scope.SharedData.originalCode);
	
			addNode($scope.SharedData.currentItem.code, parent_id, 0, $scope.SharedData.currentItem, 'food');

			resetProperties();

		}, function errorCallback(response) { showMessage('Failed to update food', 'danger'); console.log(response); });
	}

	// Category Actions

	$scope.addCategory = function() {
	
		setAttributes();

		delete $scope.SharedData.currentItem.version;
		
		$http({
			method: 'POST',
			url: api_base_url + 'categories/new',
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem
		}).then(function successCallback(response) {

			showMessage('Category added', 'success');
			$scope.SharedData.currentItem = new Object();
			$('input').removeClass('valid invalid');
			$scope.$apply();

		}, function errorCallback(response) { showMessage('Failed to add category', 'danger'); console.log(response); });
	}

	$scope.discardCategoryChanges = function() {

		loadItem('category', $scope.SharedData.currentItem.code, $scope.SharedData.currentItem.code);
	}

	$scope.deleteCategory = function() {

		if (confirm("Delete " + $scope.SharedData.currentItem.code + "?"))
		{
			var category_code = $scope.SharedData.currentItem.code;

			$http({
				method: 'DELETE',
				url: api_base_url + 'categories/' + category_code,
				headers: { 'X-Auth-Token': Cookies.get('auth-token') }
			}).then(function successCallback(response) {

				showMessage('Category deleted', 'success');
				
				deleteNode($scope.SharedData.currentItem.code);
				resetProperties();

			}, function errorCallback(response) { showMessage('Failed to delete category', 'danger'); });
		}
	}

	$scope.updateCategory = function() {
		
		setAttributes();

		$http({
			method: 'POST',
			url: api_base_url + 'categories/' + $scope.SharedData.originalCode,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
			data: $scope.SharedData.currentItem
		}).then(function successCallback(response) {

			showMessage('Category updated', 'success');

			fetchCategoriesService.broadcast();

		}, function errorCallback(response) { showMessage('Failed to update category', 'danger'); console.log(response); });
	}

	function addFoodToCategory(food_code, category_code)
	{
		$http({
			method: 'PUT',
			url: api_base_url + 'categories/' + category_code + '/foods/' + food_code,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') },
		}).then(function successCallback(response) {

			showMessage('Food added to category', 'success');

			fetchCategoriesService.broadcast();

		}, function errorCallback(response) { showMessage('Failed to add to category', 'danger'); console.log(response); });
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

	function handleError(response) {

		console.log(response);
		if (response.status === 401) { alert('Unauthorized'); Cookies.remove('auth-token'); }
	}

});