angular.module('intake24.admin.food_db').factory('UserFoodData', ['$http', 'Locales', function($http, locales) {

	function authApiCallFuture(method, url) {
		return $http({
			method: method,
			url: api_base_url + url,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		}).then(
			function(response) {
				return response.data;
			}
		);
	}

	return {
		getFoodData: function(code) {
			return authApiCallFuture('GET', 'user/foods/' + locales.current() + '/' + code);
		},

		getFoodDataWithSources: function(code) {
			return authApiCallFuture('GET', 'user/foods/' + locales.current() + '/' + code + '/with-sources');
		},

		getAssociatedFoods: function(code) {
			return authApiCallFuture('GET', 'user/foods/' + locales.current() + '/' + code + '/associated-foods');
		}
	};

}]);
