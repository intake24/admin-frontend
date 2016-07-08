'use strict';

module.exports = function(app) {
    app.service('FoodDataReader', ['$http', 'Locales', serviceFun]);
};

function serviceFun ($http, locales) {

    return {
        getRootCategories: function () {
            return $http.get(api_base_url + 'admin/categories/' + locales.current());
        },

        getUncategorisedFoods: function () {
            return $http.get(api_base_url + 'admin/foods/' + locales.current() + '/uncategorised')
        },

        getCategoryContents: function (code) {
            return $http.get(api_base_url + 'admin/categories/' + locales.current() + '/' + code);
        },

        getCategoryDefinition: function (code) {
            return $http.get(api_base_url + 'admin/categories/' + locales.current() + '/' + code + '/definition');
        },

        getFoodDefinition: function (code) {
            return $http.get(api_base_url + 'admin/foods/' + locales.current() + '/' + code + '/definition');
        },

        getCategoryParentCategories: function (code) {
            return $http.get(api_base_url + 'admin/categories/' + locales.current() + '/' + code + '/parent-categories');
        },

        getCategoryAllCategories: function (code) {
            return $http.get(api_base_url + 'admin/categories/' + locales.current() + '/' + code + '/all-categories');
        },

        getFoodParentCategories: function (code) {
            return $http.get(api_base_url + 'admin/foods/' + locales.current() + '/' + code + '/parent-categories');
        },

        getFoodAllCategories: function (code) {
            return $http.get(api_base_url + 'admin/foods/' + locales.current() + '/' + code + '/all-categories');
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
            return $http.get(api_base_url + 'admin/categories/' + locales.current() + '/search/' + query);
        },

        searchFoods: function (query, onSuccess, onFailure) {
            return $http.get(api_base_url + 'admin/foods/' + locales.current() + '/search/' + query);
        },

        fetchNutrientTables: function () {
            return $http.get(api_base_url + 'admin/nutrient-tables');
        }
    };
}
