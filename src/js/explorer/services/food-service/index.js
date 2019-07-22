/**
 * Created by Tim Osadchiy on 13/11/2016.
 */

"use strict";

module.exports = function (app) {
    app.service("FoodService", ["$http", "$q", "LocalesService", "PackerService", serviceFun]);
};

function serviceFun($http, $q, LocalesService, PackerService) {

    return {
        getRootCategories: function (locale) {
            return $http.get(api_base_url + "v2/foods/admin/" + locale + "/root-categories")
                .then(function (data) {
                    var result = data.map(PackerService.unpackCategoryHeader);
                    result.unshift({
                        displayName: "Uncategorised foods", //FIXME: use localised string
                        englishDescription: "Uncategorised foods",
                        code: "$UNCAT",
                        type: "category",
                        children: []
                    });
                    return result;
                });
        },

        getUncategorisedFoods: function (locale) {
            return $http.get(api_base_url + "v2/foods/admin/" + locale + "/uncategorised-foods")
                .then(function (data) {
                    return data.map(PackerService.unpackFoodHeader);
                });
        },

        getCategoryContents: function (locale, code) {
            return $http.get(api_base_url + "v2/foods/admin/" + locale + "/categories/" + code + "/contents")
                .then(function (data) {
                    return PackerService.unpackCategoryContents(data);
                });
        },

        getCategoryDefinition: function (locale, code) {
            return $http.get(api_base_url + "admin/categories/" + locale + "/" + code)
                .then(function (data) {
                    return PackerService.unpackCategoryRecord(data);
                });
        },

        getFoodDefinition: function (locale, code) {
            return $http.get(api_base_url + "admin/foods/" + locale + "/" + code)
                .then(function (data) {
                    return PackerService.unpackFoodRecord(data);
                });
        },

        getCategoryParentCategories: function (locale, code) {
            return $http.get(api_base_url + "admin/browse/" + locale + "/category-parent-categories" + "/" + code);
        },

        getCategoryAllCategories: function (locale, code) {
            return $http.get(api_base_url + "admin/browse/" + locale + "/category-all-categories" + "/" + code);
        },

        getFoodParentCategories: function (locale, code) {
            return $http.get(api_base_url + "admin/browse/" + locale + "/food-parent-categories" + "/" + code);
        },

        getFoodAllCategories: function (locale, code) {
            return $http.get(api_base_url + "admin/browse/" + locale + "/food-all-categories" + "/" + code);
        },

        getFoodGroups: function (locale) {
            return $http.get(api_base_url + "admin/food-groups/" + locale)
                .then(function(data) {
                    return PackerService.unpackFoodGroups(data);
                });
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

        searchCategories: function (locale, query, onSuccess, onFailure) {
            return $http.get(api_base_url + "admin/quick-search/" + locale + "/categories/" + query)
                .then(function (data) {
                    return data.map(PackerService.unpackCategoryHeader);
                });
        },

        searchFoods: function (locale, query, onSuccess, onFailure) {
            return $http.get(api_base_url + "admin/quick-search/" + locale + "/foods/" + query)
                .then(function (data) {
                    return data.map(PackerService.unpackFoodHeader);
                });
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
            return $http.post(api_base_url + 'admin/categories/' + category_code, PackerService.packCategoryMainRecordUpdate(definition));
        },

        createNewCategory: function (definition) {
            return $http.post(api_base_url + 'admin/categories/new', PackerService.packNewCategoryRecord(definition));
        },

        updateCategoryLocalRecord: function (locale, category_code, definition) {
            return $http.post(api_base_url + 'admin/categories/' + locale + '/' + category_code, PackerService.packCategoryLocalRecordUpdate(definition));
        },

        updateFoodMainRecord: function (food_code, mainRecord) {
            var packed = PackerService.packFoodMainRecordUpdate(mainRecord);
            return $http.post(api_base_url + 'admin/foods/' + food_code, packed);
        },

        createNewFood: function (definition) {
            return $http.post(api_base_url + 'admin/foods/new', PackerService.packNewFoodRecord(definition));
        },

        createNewLocalFood: function (locale, definition) {
            return $http.post(api_base_url + 'admin/foods/new/' + locale, PackerService.packNewLocalFoodRecord(definition));
        },

        createNewFoodWithTempCode: function (definition) {
            return $http.post(api_base_url + 'admin/foods/new-with-temp-code', definition);
        },

        updateFoodLocalRecord: function (locale, food_code, localRecord) {
            var packed = PackerService.packFoodLocalRecordUpdate(localRecord);
            return $http.post(api_base_url + 'admin/foods/' + locale + '/' + food_code, packed);
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

        getCategoryProblemsRecursive: function (locale, code, onSuccess, onFailure) {
            return $http({
                method: 'GET',
                url: api_base_url + 'admin/categories/' + locale + '/' + code + '/recursive-problems',
                expectedStatusCodes: [200, 503]
            });
        },

        getFoodProblems: function (locale, code, onSuccess, onFailure) {
            return $http({
                method: 'GET',
                url: api_base_url + 'admin/foods/' + locale + '/' + code + '/problems',
                expectedStatusCodes: [200, 503]
            });
        },

        cloneFood: function(locale, code, onSuccess, onFailure) {
            return $http.post(api_base_url + 'admin/foods/' + locale + '/' + code + '/clone');
        },

        cloneFoodAsLocal: function(locale, code, onSuccess, onFailure) {
            return $http.post(api_base_url + 'admin/foods/' + locale + '/' + code + '/clone-as-local');
        }

    };
}
