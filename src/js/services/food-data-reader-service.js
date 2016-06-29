'use strict';

module.exports = function(app) {
    app.service('FoodDataReader', ['$http', 'Locales', serviceFun]);
};

function serviceFun ($http, locales) {

    function authApiCallFuture(method, url, onSuccess, onFailure) {
        return $http({
            method: method,
            url: api_base_url + url,
            headers: {'X-Auth-Token': Cookies.get('auth-token')}
        }).then(
            function (response) {
                return response.data;
            }
        );
    }

    return {
        getRootCategories: function () {
            return authApiCallFuture('GET', 'admin/categories/' + locales.current());
        },

        getUncategorisedFoods: function () {
            return authApiCallFuture('GET', 'admin/foods/' + locales.current() + '/uncategorised')
        },

        getCategoryContents: function (code) {
            return authApiCallFuture('GET', 'admin/categories/' + locales.current() + '/' + code);
        },

        getCategoryDefinition: function (code) {
            return authApiCallFuture('GET', 'admin/categories/' + locales.current() + '/' + code + '/definition');
        },

        getFoodDefinition: function (code) {
            return authApiCallFuture('GET', 'admin/foods/' + locales.current() + '/' + code + '/definition');
        },

        getCategoryParentCategories: function (code) {
            return authApiCallFuture('GET', 'admin/categories/' + locales.current() + '/' + code + '/parent-categories');
        },

        getCategoryAllCategories: function (code) {
            return authApiCallFuture('GET', 'admin/categories/' + locales.current() + '/' + code + '/all-categories');
        },

        getFoodParentCategories: function (code) {
            return authApiCallFuture('GET', 'admin/foods/' + locales.current() + '/' + code + '/parent-categories');
        },

        getFoodAllCategories: function (code) {
            return authApiCallFuture('GET', 'admin/foods/' + locales.current() + '/' + code + '/all-categories');
        },

        getFoodGroups: function () {
            return authApiCallFuture('GET', 'admin/food-groups/' + locales.current());
        },

        getAsServedImageSets: function () {
            return authApiCallFuture('GET', 'admin/portion-size/as-served');
        },

        getGuideImages: function () {
            return authApiCallFuture('GET', 'admin/portion-size/guide-image');
        },

        getDrinkwareSets: function () {
            return authApiCallFuture('GET', 'admin/portion-size/drinkware');
        },

        searchCategories: function (query, onSuccess, onFailure) {
            return authApiCallFuture('GET', 'admin/categories/' + locales.current() + '/search/' + query);
        },

        searchFoods: function (query, onSuccess, onFailure) {
            return authApiCallFuture('GET', 'admin/foods/' + locales.current() + '/search/' + query);
        },

        fetchNutrientTables: function () {
            return authApiCallFuture('GET', 'admin/nutrient-tables');
        }
    };
}
