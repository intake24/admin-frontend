angular.module('intake24.admin.food_db').factory('FoodDataReader', ['$http', 'Locales', function($http, locales) {

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
		getRootCategories: function(onSuccess, onFailure) {
			authApiCall('GET', 'admin/categories/' + locales.current(), onSuccess, onFailure);
		},

		getUncategorisedFoods: function(onSuccess, onFailure) {
			authApiCall('GET', 'admin/foods/' + locales.current() + '/uncategorised', onSuccess, onFailure);
		},

		getCategoryContents: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'admin/categories/' + locales.current() + '/' + code, onSuccess, onFailure);
		},

		getCategoryDefinition: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'admin/categories/' + locales.current() + '/' + code + '/definition', onSuccess, onFailure);
		},

		getFoodDefinition: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'admin/foods/' + locales.current() + '/' + code + '/definition', onSuccess, onFailure);
		},

		getCategoryParentCategories: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'admin/categories/' + locales.current() + '/' + code + '/parent-categories', onSuccess, onFailure);
		},

		getFoodParentCategories: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'admin/foods/' + locales.current() + '/' + code + '/parent-categories', onSuccess, onFailure);
		},

		getFoodGroups: function(onSuccess, onFailure) {
			authApiCall('GET', 'admin/food-groups/' + locales.current(), onSuccess, onFailure);
		},

		getAsServedImageSets: function(onSuccess, onFailure) {
			authApiCall('GET', 'admin/portion-size/as-served', onSuccess, onFailure);
		},

		getGuideImages: function(onSuccess, onFailure) {
			authApiCall('GET', 'admin/portion-size/guide-image', onSuccess, onFailure);
		},

		getDrinkwareSets: function(onSuccess, onFailure) {
			authApiCall('GET', 'admin/portion-size/drinkware', onSuccess, onFailure);
		},

		searchCategories: function(query, onSuccess, onFailure) {
			authApiCall('GET', 'admin/categories/' + locales.current() + '/search/' + query, onSuccess, onFailure);
		},

		searchFoods: function(query, onSuccess, onFailure) {
			authApiCall('GET', 'admin/foods/' + locales.current() + '/search/' + query, onSuccess, onFailure);
		}
	};
}]);
