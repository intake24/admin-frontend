angular.module('intake24.admin.food_db').factory('Problems', ['$http', 'Locales', function($http, locales) {
	return {
		getCategoryProblemsRecursive: function(code, onSuccess, onFailure)
		{
			$http({
					method: 'GET',
					url: api_base_url + 'admin/categories/' + locales.current() + '/' + code + '/problems/recursive',
					headers: { 'X-Auth-Token': Cookies.get('auth-token') }
				}).then(function (response) {
					onSuccess(response.data);
				}, function (response) { onFailure(response); });
		},

		getFoodProblems: function(code, onSuccess, onFailure)
		{
			$http({
					method: 'GET',
					url: api_base_url + 'admin/foods/' + locales.current() + '/' + code + '/problems',
					headers: { 'X-Auth-Token': Cookies.get('auth-token') }
				}).then(function (response) {
					onSuccess(response.data);
				}, function (response) { onError(response); });
		}
	};
}]);
