/**
 * Created by Tim Osadchiy on 13/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.service("FoodService", ["$http", "$q", "LocalesService", "PackerService", serviceFun]);
};

function serviceFun($http, $q, LocalesService, PackerService) {

    return {
        getRootCategories: function () {
            return $http.get(api_base_url + "admin/browse/" + LocalesService.current() + "/root-categories");
        },

        getUncategorisedFoods: function () {
            return $http.get(api_base_url + "admin/browse/" + LocalesService.current() + "/uncategorised-foods")
        },

        getCategoryContents: function (code) {
            return $http.get(api_base_url + "admin/browse/" + LocalesService.current() + "/" + code);
        },

        getCategoryDefinition: function (code) {
            return $http.get(api_base_url + "admin/categories/" + LocalesService.current() + "/" + code);
        },

        getFoodDefinition: function (code) {
            return $http.get(api_base_url + "admin/foods/" + LocalesService.current() + "/" + code);
        },

        getCategoryParentCategories: function (code) {
            return $http.get(api_base_url + "admin/browse/" + LocalesService.current() + "/category-parent-categories" + "/" + code);
        },

        getCategoryAllCategories: function (code) {
            return $http.get(api_base_url + "admin/browse/" + LocalesService.current() + "/category-all-categories" + "/" + code);
        },

        getFoodParentCategories: function (code) {
            return $http.get(api_base_url + "admin/browse/" + LocalesService.current() + "/food-parent-categories" + "/" + code);
        },

        getFoodAllCategories: function (code) {
            return $http.get(api_base_url + "admin/browse/" + LocalesService.current() + "/food-all-categories" + "/" + code);
        },

        getFoodGroups: function () {
            return $http.get(api_base_url + "admin/food-groups/" + LocalesService.current());
        },

        getAsServedImageSets: function () {
            return $http.get(api_base_url + "admin/portion-size/as-served");
        },

        getGuideImages: function () {
            return $http.get(api_base_url + "admin/portion-size/guide-image");
        },

        getDrinkwareSets: function () {
            return $http.get(api_base_url + "admin/portion-size/drinkware");
        },

        searchCategories: function (query, onSuccess, onFailure) {
            return $http.get(api_base_url + "admin/quick-search/" + LocalesService.current() + "/categories/" + query);
        },

        searchFoods: function (query, onSuccess, onFailure) {
            return $http.get(api_base_url + "admin/quick-search/" + LocalesService.current() + "/foods/" + query);
        },

        fetchNutrientTables: function () {
            return $http.get(api_base_url + "admin/nutrient-tables");
        },

        addFoodToCategory: function (category_code, food_code) {
            return $http.put(api_base_url + 'admin/categories/' + category_code + '/foods/' + food_code);
        },

        addCategoryToCategory: function (category_code, subcategory_code) {
            return $http.put(api_base_url + 'admin/categories/' + category_code + '/subcategories/' + subcategory_code);
        },

        removeFoodFromCategory: function (category_code, food_code) {
            return $http.delete(api_base_url + 'admin/categories/' + category_code + '/foods/' + food_code);
        },

        removeCategoryFromCategory: function (category_code, subcategory_code) {
            return $http.delete(api_base_url + 'admin/categories/' + category_code + '/subcategories/' + subcategory_code);
        },

        updateCategoryMainRecord: function (category_code, definition) {
            return $http.post(api_base_url + 'admin/categories/' + category_code, definition);
        },

        createNewCategory: function (definition) {
            return $http.post(api_base_url + 'admin/categories/new', definition);
        },

        updateCategoryLocalRecord: function (category_code, definition) {
            return $http.post(api_base_url + 'admin/categories/' + LocalesService.current() + '/' + category_code, definition);
        },

        updateFoodMainRecord: function (food_code, definition) {
            return $http.post(api_base_url + 'admin/foods/' + food_code, definition);
        },

        createNewFood: function (definition) {
            return $http.post(api_base_url + 'admin/foods/new', definition);
        },

        createNewFoodWithTempCode: function (definition) {
            return $http.post(api_base_url + 'admin/foods/new-with-temp-code', definition);
        },

        updateFoodLocalRecord: function (food_code, definition) {
            return $http.post(api_base_url + 'admin/foods/' + LocalesService.current() + '/' + food_code, definition);
        },

        checkFoodCode: function (food_code) {
            return $http.get(api_base_url + 'admin/foods/code-available/' + food_code);
        },

        checkCategoryCode: function (category_code) {
            return $http.get(api_base_url + 'admin/categories/code-available/' + category_code);
        },

        deleteFood: function (food_code) {
            return $http.delete(api_base_url + 'admin/foods/' + food_code);
        },

        deleteCategory: function (category_code) {
            return $http.delete(api_base_url + 'admin/categories/' + category_code);
        },

        getCategoryProblemsRecursive: function (code, onSuccess, onFailure) {
            return $http.get(api_base_url + 'admin/categories/' + LocalesService.current() + '/' + code + '/recursive-problems');
        },

        getFoodProblems: function (code, onSuccess, onFailure) {
            return $http.get(api_base_url + 'admin/foods/' + LocalesService.current() + '/' + code + '/problems');
        },

        cloneFood: require("./clone-food-service-factory")($q, PackerService)
    };
}
