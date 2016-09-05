'use strict';

module.exports = function(app) {
    app.service('FoodDataReader', ['$http', 'Locales', serviceFun]);
};

function serviceFun ($http, locales) {

    return {
        getRootCategories: function () {
            return $http.get(api_base_url + 'admin/browse/' + locales.current() + '/root-categories');
        },

        getUncategorisedFoods: function () {
            return $http.get(api_base_url + 'admin/browse/' + locales.current() + '/uncategorised-foods')
        },

        getCategoryContents: function (code) {
            return $http.get(api_base_url + 'admin/browse/' + locales.current() + '/' + code);
        },

        getCategoryDefinition: function (code, locale) {
            return $http.get(api_base_url + 'admin/categories/' + locale + '/' + code);
        },

        getFoodDefinition: function (code, locale) {
            return $http.get(api_base_url + 'admin/foods/' + locale + '/' + code);
        },

        getCategoryParentCategories: function (code) {
            return $http.get(api_base_url + 'admin/browse/' + locales.current() + '/' + code + '/category-parent-categories');
        },

        getCategoryAllCategories: function (code) {
            return $http.get(api_base_url + 'admin/browse/' + locales.current() + '/' + code + '/category-all-categories');
        },

        getFoodParentCategories: function (code) {
            return $http.get(api_base_url + 'admin/browse/' + locales.current() + '/' + code + '/food-parent-categories');
        },

        getFoodAllCategories: function (code) {
            return $http.get(api_base_url + 'admin/browse/' + locales.current() + '/' + code + '/food-all-categories');
        },

        getFoodGroups: function () {
            return $http.get(api_base_url + 'admin/food-groups/' + locales.current());
        },

        getAsServedImageSets: function () {
            return $http.get(api_base_url + 'admin/portion-size/as-served');
        },

        getGuideImages: function () {
            return $http.get(api_base_url + 'admin/portion-size/guide-image');
        },

        getDrinkwareSets: function () {
            return $http.get(api_base_url + 'admin/portion-size/drinkware');
        },

        searchCategories: function (query, onSuccess, onFailure) {
            return $http.get(api_base_url + 'admin/quick-search/' + locales.current() + '/categories/' + query);
        },

        searchFoods: function (query, onSuccess, onFailure) {
            return $http.get(api_base_url + 'admin/quick-search/' + locales.current() + '/foods/' + query);
        },

        fetchNutrientTables: function () {
            return $http.get(api_base_url + 'admin/nutrient-tables');
        }
    };
}
