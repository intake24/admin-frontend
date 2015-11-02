var api_base_url = 'http://api-test.intake24.co.uk/';
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyLUI5MGU4YzFMcHhPM0N6clpsakNaS2JxbUJqaVFDUzhBNVdFXC9ObktwY2JkUnFoWEh1Vkxzc1YwaHZKZVJ5RHVqUmx3QXk1Q2U2TlhHSkRHRkg4RmJ3YXh5dlE9PSIsImkyNHAiOltdLCJpMjRyIjpbImFkbWluIl0sImlzcyI6InBsYXktc2lsaG91ZXR0ZSIsImV4cCI6MTQ0NDg1ODk1NCwiaWF0IjoxNDQ0ODE1NzU0LCJqdGkiOiI2OGIxZTMyMGViMzE1Yjk0OTEzM2JmYzAzNDEyNWViMDIwMmViNWYyOTkyNDIyNmY1MTBkZGEyMjg0NDc0ZjU3ZTZhMTM1YWE0ZGI1MDA5OWU1MzFhNTA1YjI2OGI5MzhiNDc0YWUyNTg1NGFiYzQ4MTM1ZDQ4ZDM5MTM2NTc0ZTc2ZTY2ZjY1NzVkOGExODgxMmQ4MzYyNTg0ZGVlNzI2YTlhYjY2OGU2YzNlOTU2ODBjMTgxOWZlNGVmMDM0Y2M0YzVkMzE0YjRiMzkxOGFlN2Y4MmMyMGI4Y2I5ZTliNDJiYjMwN2Q2MGRjZTMyYzYyN2RhZDAzYjBmMzE5MThmIn0.v7AR8IfbgGHYaZEiJ1DJilEiWGUnfPmLxGnsX5Aq_CU';
// var token = '';
var locale = 'en';

<<<<<<< HEAD
var app = angular.module('app', []);

app.service("fetchCategoriesService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("fetchCategories")}
    this.listen = function(callback) { $rootScope.$on("fetchCategories", callback)}
})
=======
app.controller('AuthController', function($scope, $http) {

	// Setup food
	$scope.food = new Object();
	$scope.search = new Object();

	// Auto fetch
	if (token != '') { fetchCategories() }

	$('#modal-authenticate input:last').keypress(function(e) {

		if (e.keyCode == 13) { $('#button-login').trigger('click') }
	});
	
	// Add mouse enter/leave events to search wrapper
	$('.search-field-wrapper').on('mouseenter', function() {

		$(this).addClass('active');
	}).on('mouseleave', function() {

		if ($('#search-field').val() == '') {
			$('#search-field').blur(); 
			$(this).removeClass('active');
		}
	})
	
	// Detect change of search query and update results
	$('#search-field').on('input', function(e) {

		var query = $(this).val();
		performFoodSearch(query);

	}).keypress(function(e) {

		if (e.keyCode == 13) {
			var query = $(this).val();
			performFoodSearch(query);
		}
	});

	// Attempt to login user
	$('#button-login').click(function() {

		var survey_id = ''; // TODO
		var username = $('#form-login-username').val();
		var password = $('#form-login-password').val();

	    $http({
		  method: 'POST',
		  url: api_base_url + 'signin',
		  data: { survey_id: survey_id, username: username, password: password }
		}).then(function successCallback(response) {
		    
		    hideModal();

		    $('a.auth-menu').addClass('authenticated');
		    $('#btn-authenticate p').html('Edward Jenkins');

		    token = response.data.token;
		    
		    fetchCategories();

		}, function errorCallback(response) { handleError(response); });

	});

	function performFoodSearch(query) {
		
		$('#search-results ul').html('');

		if (query == '') {
			$('.food-list-container').show();
			return;
		} else {
			$('.food-list-container').hide();
		}

		$http({
			method: 'GET',
			url: api_base_url + 'foods/' + locale + '/search/' + query,
			headers: { 'X-Auth-Token': token }
		}).then(function successCallback(response) {

			console.log(response);

			var type = 'food';

			$scope.search = new Object();

			$.each(response.data, function(index, value) {

				$('#search-results ul').append('<li data-type="' + type + '" data-index="' + index + '">' + value.englishDescription + '</li>');
				$scope.search[index] = value;
			});

			addSearchResultHandlers();

		}, function errorCallback(response) { handleError(response); });

	}

	function addSearchResultHandlers() {

		$('#search-results ul li').click(function() {

			$('#search-results ul li').removeClass('active');

			$(this).addClass('active');

			var type = $(this).attr('data-type');
			var index = $(this).attr('data-index');

			$('.properties-col').addClass('active');

			console.log($scope.search);

			var item = $scope.search[index];
			
			console.log(item);

			switch (type) {

				case "category":

					$('#category-properties-container').show();
					$('#food-properties-container').hide();

					// Category selected so lets fetch that definition
					$http({
						method: 'GET',
						url: api_base_url + 'categories/' + locale + '/' + item.code + '/definition',
						headers: { 'X-Auth-Token': token }
					}).then(function successCallback(response) {

						console.log(response);

					}, function errorCallback(response) { handleError(response); });

					$('#input-category-code').val(item.code);
					$('#input-category-englishDescription').val(item.englishDescription);
					break;

				case "food":
						
					$('#category-properties-container').hide();
					$('#food-properties-container').show();

					// Food selected so lets fetch that definition
					$http({
						method: 'GET',
						url: api_base_url + 'foods/en/' + item.code + '/definition',
						headers: { 'X-Auth-Token': token }
					}).then(function successCallback(response) {

						console.log(response);

						$('#input-food-code').val(response.data.code);
						$('#input-food-englishDescription').val(response.data.englishDescription);
						$('#input-NDNS-code').val(response.data.nutrientTableCodes.NDNS);

					}, function errorCallback(response) { handleError(response); });

					break;

				default:
			}
		})
	}

	function fetchCategories() {

		// Initialise jstree
		$('#food-list').jstree({'core' : {'check_callback': true}});

		$http({
			method: 'GET',
			url: api_base_url + 'categories/' + locale,
			headers: { 'X-Auth-Token': token }
		}).then(function successCallback(response) {

			$.each(response.data, function(index, value) {
				addNode(value.code, "#", index, value, 'category');
			});
			
			addHandlers();

		}, function errorCallback(response) { handleError(response); });
	}

	function addHandlers() {

		$('#food-list').on("select_node.jstree", function (e, data, node) {

			$('.properties-col').addClass('active');

			var item = $scope.food[data.node.id];

			switch (data.node.data["type"]) {

				case "category":

					$('#category-properties-container').show();
					$('#food-properties-container').hide();

					// Category selected so lets fetch that definition
					$http({
						method: 'GET',
						url: api_base_url + 'categories/en_GB/' + item.code + '/definition',
						headers: { 'X-Auth-Token': token }
					}).then(function successCallback(response) {

						console.log(response);

					}, function errorCallback(response) { handleError(response); });

					$('#input-category-code').val(item.code);
					$('#input-category-englishDescription').val(item.englishDescription);
					break;

				case "food":
						
					$('#category-properties-container').hide();
					$('#food-properties-container').show();

					// Food selected so lets fetch that definition
					$http({
						method: 'GET',
						url: api_base_url + 'foods/en/' + item.code + '/definition',
						headers: { 'X-Auth-Token': token }
					}).then(function successCallback(response) {

						console.log(response);

						$('#input-food-code').val(response.data.code);
						$('#input-food-englishDescription').val(response.data.englishDescription);
						$('#input-NDNS-code').val(response.data.nutrientTableCodes.NDNS);

					}, function errorCallback(response) { handleError(response); });

					break;

				default:
			}
			
		});

		$('#food-list').on("hover_node.jstree", function (e, data, node) {

			if (data.node.children.length != 0) { console.log('has children'); return; };

			if ($scope.food[data.node.id]['loading']) { return; };

			var item = $scope.food[data.node.id];

			$scope.food[data.node.id]['loading'] = true;

			$http({
				method: 'GET',
				url: api_base_url + 'categories/' + locale + '/' + item['code'],
				headers: { 'X-Auth-Token': token }
			}).then(function successCallback(response) {

				$.each(response.data.subcategories, function(index, value) {
					addNode(value.code, data.node.id, index, value, 'category'); });

				$.each(response.data.foods, function(index, value) {
					addNode(value.code, data.node.id, index, value, 'food'); });

				$scope.food[data.node.id]['loading'] = false;

			}, function errorCallback(response) { handleError(response); });
		});
	}

	function addNode(node_id, parent_id, index, value, type) {

		if (value.isHidden)
			return;

		if ($('#' + node_id).length > 0)
			return;

		$('#food-list').jstree().create_node(parent_id, { "id" : node_id, "index" : index, "data" : { "type" : type }, "text" : value.englishDescription}, "last", function() {
			$scope.food[node_id] = value; });
	}

	function handleError(response) {

		console.log(response);
		if (response.status === 401) { alert('Unauthorized') }
	}
});
>>>>>>> parent of d0e8920... Updates

$(document).ready(function() {
	$('#flash-dismiss-btn').click(function() {
		hideMessage();
	});
});

function showMessage(message, type) {
	$('.flash-message #message').html(message);
	$('.flash-message').removeClass('success warning danger').addClass(type).addClass('active');
	setTimeout(function() {hideMessage()}, 2000);
}

<<<<<<< HEAD
function hideMessage() {
	$('.flash-message').removeClass('active');
}
=======
	// Click handler on menu button to toggle sidebar
	$('#sidebar-button').click(function() { $('.sidebar').toggleClass('active') });

});
>>>>>>> parent of d0e8920... Updates
