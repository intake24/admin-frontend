angular.module('intake24.admin.food_db').factory('Problems', ['$http', 'Locales', function($http, locales) {
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
		getCategoryProblemsRecursive: function(code, onSuccess, onFailure)
		{
			return authApiCallFuture('GET', 'admin/categories/' + locales.current() + '/' + code + '/problems/recursive');
		},

		getFoodProblems: function(code, onSuccess, onFailure)
		{
			return authApiCallFuture('GET', 'admin/foods/' + locales.current() + '/' + code + '/problems');
		}
	};
}]);
