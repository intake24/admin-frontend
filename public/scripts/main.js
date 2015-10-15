var app = angular.module('app', []);
var api_base_url = 'http://api-test.intake24.co.uk/';
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyLUI5MGU4YzFMcHhPM0N6clpsakNaS2JxbUJqaVFDUzhBNVdFXC9ObktwY2JkUnFoWEh1Vkxzc1YwaHZKZVJ5RHVqUmx3QXk1Q2U2TlhHSkRHRkg4RmJ3YXh5dlE9PSIsImkyNHAiOltdLCJpMjRyIjpbImFkbWluIl0sImlzcyI6InBsYXktc2lsaG91ZXR0ZSIsImV4cCI6MTQ0NDg1ODk1NCwiaWF0IjoxNDQ0ODE1NzU0LCJqdGkiOiI2OGIxZTMyMGViMzE1Yjk0OTEzM2JmYzAzNDEyNWViMDIwMmViNWYyOTkyNDIyNmY1MTBkZGEyMjg0NDc0ZjU3ZTZhMTM1YWE0ZGI1MDA5OWU1MzFhNTA1YjI2OGI5MzhiNDc0YWUyNTg1NGFiYzQ4MTM1ZDQ4ZDM5MTM2NTc0ZTc2ZTY2ZjY1NzVkOGExODgxMmQ4MzYyNTg0ZGVlNzI2YTlhYjY2OGU2YzNlOTU2ODBjMTgxOWZlNGVmMDM0Y2M0YzVkMzE0YjRiMzkxOGFlN2Y4MmMyMGI4Y2I5ZTliNDJiYjMwN2Q2MGRjZTMyYzYyN2RhZDAzYjBmMzE5MThmIn0.v7AR8IfbgGHYaZEiJ1DJilEiWGUnfPmLxGnsX5Aq_CU';
// var token = '';
var locale = 'en';

app.controller('AuthController', function($scope, $http) {

	// Setup food
	$scope.food = new Object();

	// Auto fetch
	if (token != '') { fetchCategories() }

	$('#modal-authenticate input:last').keypress(function(e) {

		if (e.keyCode == 13) { $('#button-login').trigger('click') }

	});

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

	function fetchCategories() {

		$http({
			method: 'GET',
			url: api_base_url + 'categories/' + locale,
			headers: { 'X-Auth-Token': token },
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

					// Category selected so lets fetch that definition
					$http({
						method: 'GET',
						url: api_base_url + 'categories/' + item.code + '/definition',
						headers: { 'X-Auth-Token': token },
					}).then(function successCallback(response) {

						console.log(response);

					}, function errorCallback(response) { handleError(response); });

					$('#input-category-code').val(item.code);
					$('#input-category-englishDescription').val(item.englishDescription);
					$('#category-properties-container').show();
					$('#food-properties-container').hide();
					break;

				case "food":

					// Food selected so lets fetch that definition
					$http({
						method: 'GET',
						url: api_base_url + 'foods/' + item.code + '/definition',
						headers: { 'X-Auth-Token': token },
					}).then(function successCallback(response) {

						console.log(response);

					}, function errorCallback(response) { handleError(response); });

					$('#input-food-code').val(item.code);
					$('#input-food-englishDescription').val(item.englishDescription);
					$('#category-properties-container').hide();
					$('#food-properties-container').show();
					break;

				default:
			}
			
		});

		$('#food-list').on("hover_node.jstree", function (e, data, node) {

			if (data.node.children.length != 0) { console.log('has children'); return; };

			var item = $scope.food[data.node.id];

			$http({
				method: 'GET',
				url: api_base_url + 'categories/' + locale + '/' + item['code'],
				headers: { 'X-Auth-Token': token },
			}).then(function successCallback(response) {

				$.each(response.data.subcategories, function(index, value) {
					addNode(value.code, data.node.id, index, value, 'category'); });

				$.each(response.data.foods, function(index, value) {
					addNode(value.code, data.node.id, index, value, 'food'); });

			}, function errorCallback(response) { handleError(response); });
		});
	}

	function addNode(node_id, parent_id, index, value, type) {

		if (value.isHidden)
			return;
		$('#food-list').jstree().create_node(parent_id, { "id" : node_id, "index" : index, "data" : { "type" : type }, "text" : value.englishDescription}, "last", function() {
			$scope.food[node_id] = value; });
	}

	function handleError(response) {

		console.log(response);
		if (response.status === 401) { alert('Unauthorized') }
	}
});

$(document).ready(function() {

	// Initialise jstree
	$('#food-list').jstree({'core' : {'check_callback': true}});

	// Click handler on menu button to toggle sidebar
	$('#sidebar-button').click(function() { $('.sidebar').toggleClass('active') });

});