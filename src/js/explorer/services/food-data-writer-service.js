'use strict';

module.exports = function (app) {
    app.service('FoodDataWriterService', ['$http', 'LocalesService', serviceFun]);
};

function serviceFun($http, LocalesService) {

    return {
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
        }
    };
}
