angular.module('intake24.admin.food_db').factory('FoodDataReader', ['$http', 'SharedData', function($http, sharedData) {

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
			authApiCall('GET', 'categories/' + sharedData.locale.intake_locale, onSuccess, onFailure);
		},

		getUncategorisedFoods: function(onSuccess, onFailure) {
			authApiCall('GET', 'foods/' + sharedData.locale.intake_locale + '/uncategorised', onSuccess, onFailure);
		},

		getCategoryContents: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'categories/' + sharedData.locale.intake_locale + '/' + code, onSuccess, onFailure);
		},

		getCategoryDefinition: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'categories/' + sharedData.locale.intake_locale + '/' + code + '/definition', onSuccess, onFailure);
		},

		getFoodDefinition: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'foods/' + sharedData.locale.intake_locale + '/' + code + '/definition', onSuccess, onFailure);
		},

		getCategoryParentCategories: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'categories/' + sharedData.locale.intake_locale + '/' + code + '/parent-categories', onSuccess, onFailure);
		},

		getFoodParentCategories: function(code, onSuccess, onFailure) {
			authApiCall('GET', 'foods/' + sharedData.locale.intake_locale + '/' + code + '/parent-categories', onSuccess, onFailure);
		},

		searchCategories: function(query, onSuccess, onFailure) {
			authApiCall('GET', 'categories/' + sharedData.locale.intake_locale + '/search/' + query, onSuccess, onFailure);
		}
	};
}]);
