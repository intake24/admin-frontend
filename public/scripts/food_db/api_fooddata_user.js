angular.module('intake24.admin.food_db').factory('UserFoodData', ['$http', 'SharedData', function($http, sharedData) {

	function authApiCall(method, url, onSuccess, onFailure) {
		$http({
			method: method,
			url: api_base_url + url,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(
			function (response) {	onSuccess(response.data);	},
			function (response) { onFailure(response); }
		);
	};

	return {
		getFoodData: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'user/foods/' + sharedData.locale.intake_locale + '/' + code, onSuccess, onFailure);
		}
	};

}]);
