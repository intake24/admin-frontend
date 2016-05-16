angular.module('intake24.admin.food_db').factory('FoodDataWriter', ['$http', 'Locales', function($http, locales) {

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

	function authApiPostFuture(url, data) {
		return $http({
			method: 'POST',
			url: api_base_url + url,
			data: data,
			headers: { 'X-Auth-Token': Cookies.get('auth-token') }
		});
	}

	return {
		addFoodToCategory: function(food_code, category_code)
		{
			return authApiCallFuture('PUT', 'admin/categories/' + category_code + '/foods/' + food_code);
		},

		addCategoryToCategory: function (category_code, subcategory_code)
		{
			return authApiCallFuture('PUT', 'admin/categories/' + category_code + '/subcategories/' + subcategory_code);
		},

		removeFoodFromCategory: function(food_code, category_code)
		{
			return authApiCallFuture('DELETE', 'admin/categories/' + category_code + '/foods/' + food_code);
		},

		removeCategoryFromCategory: function (category_code, subcategory_code)
		{
			return authApiCallFuture('DELETE', 'admin/categories/' + category_code + '/subcategories/' + subcategory_code);
		},

		updateCategoryBase: function (category_code, definition)
		{
			return authApiPostFuture('admin/categories/' + category_code, definition);
		},

		updateFoodBasic: function (food_code, definition)
		{
			return authApiPostFuture('admin/foods/' + food_code, definition);
		},

		updateFoodLocal: function(food_code, definition)
		{
			return authApiPostFuture('admin/foods/' + locales.current() + '/' + food_code, definition);
		},

		checkFoodCode: function(food_code) {
			return authApiCallFuture('GET', 'admin/foods/code-available/' + food_code );
		},

		checkCategoryCode: function(category_code) {
			return authApiCallFuture('GET', 'admin/categories/code-available/' + category_code );
		}

	};
}]);
