// Authentication (AuthController)

app.controller('AuthController', function($scope, $http, fetchCategoriesService) {

	// Check authentication
	if (Cookies.get('auth-token')) {
		fetchCategoriesService.broadcast();

	    hideModal();

	    $('body').addClass('authenticated');
	    $('#btn-authenticate p').html('Edward Jenkins');
	} else {
		showModal('modal-authenticate');
	}

	$('#modal-authenticate input').off().keypress(function(e) {

		if (e.keyCode == 13) { $('#button-login').trigger('click') }
	});

	// Attempt to logout user
	$('#button-logout').off().click(function() {

		Cookies.remove('auth-token');

	    $('body').removeClass('authenticated');
		$('#btn-authenticate p').html('Login');

		hideModal();
		showModal('modal-authenticate');
	});

	// Attempt to login user
	$('#button-login').off().click(function() {

		var survey_id = ''; // TODO
		var username = $('#form-login-username').val();
		var password = $('#form-login-password').val();

	    $http({
		  method: 'POST',
		  url: api_base_url + 'signin',
		  data: { survey_id: survey_id, username: username, password: password }
		}).then(function successCallback(response) {
		    
		    Cookies.set('auth-token', response.data.token);
    		
    		fetchCategoriesService.broadcast();
    
		    hideModal();

		    $('body').addClass('authenticated');
		    $('#btn-authenticate p').html('Edward Jenkins');

		}, function errorCallback(response) { handleError(response); });

	});

	function handleError(response) {

		console.log(response);
		if (response.status === 401) { alert('Unauthorized'); Cookies.remove('auth-token'); }
	}
});