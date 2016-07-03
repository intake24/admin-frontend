/* Controller for the "Manage categories" drawer
 *
 *	When opened, takes a snapshot of the current parent categories from the parent
 * PropertiesController as "fixed" categories.
 *
 * Fixed categories can be toggled to add/remove them from the PropertiesController
 * parentCategory list. The fixed list is maintained so that deselected categories stay
 * on the list and can be easily re-selected.
 *
 * New categories can be added by typing in the search box. Any clicked categories
 * from the search results will be added to the fixed list for the current category
 * management session. This will be reset the next time the categories drawer is
 * open.
 */

'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('CategoryManagerController', ['$scope', 'FoodDataReader', 'Packer', controllerFun]);
};

function controllerFun($scope, foodDataReader, packer) {

    // Backing variable for the currentSearch model getter/setter
    var currentSearchQuery = null;

    // The list of categories matching current search query, loaded asynchronously
    $scope.searchResults = null;

    // Fixed category list, see comment on top
    $scope.fixedCategories = [];

    function makeFixed(categoryHeader) {
        var filtered = _.filter($scope.fixedCategories, function (c) {
            return c.code != categoryHeader.code
        });
        filtered.push(categoryHeader);
        $scope.fixedCategories = filtered;
    }

    function loadSearchResults() {
        foodDataReader.searchCategories(currentSearchQuery).then(function (categories) {
                $scope.searchResults = _.map(categories, packer.unpackCategoryHeader);
            },
            $scope.handleError
        );
    }

    $scope.$on("intake24.admin.food_db.CategoryManagerDrawerOpened", function (event) {
        $scope.fixedCategories = $scope.parentCategories;
    });

    $scope.toggleParentCategory = function (categoryHeader) {
        // Try to remove the category first
        var filtered = _.filter($scope.parentCategories, function (c) {
            return c.code != categoryHeader.code
        });

        if (filtered.length == $scope.parentCategories.length) {
            // Category wasn't in the parentCategories list (since nothing was removed
            // by the grep filter), so we need to add it
            $scope.parentCategories.push(categoryHeader);
            makeFixed(categoryHeader);
        } else {
            // Category was already filtered out
            // Use $parent so we don't shadow the parent scope field
            $scope.$parent.parentCategories = filtered;
        }
    };

    $scope.isInParentCategories = function (categoryHeader) {
        if ($scope.parentCategories != null)
            for (var i = 0; i < $scope.parentCategories.length; i++) {
                if ($scope.parentCategories[i].code == categoryHeader.code)
                    return true;
            }
        return false;
    };

    $scope.searchQuery = function (newValue) {
        if (arguments.length == 1) {
            if (newValue.length > 0) {
                // If the query string is not empty, fetch search results from the
                // server
                currentSearchQuery = newValue;
                loadSearchResults();
            } else {
                // If the query string is empty, treat it as null (for ng-if directives)
                currentSearchQuery = null;
            }
        } else {
            return currentSearchQuery;
        }
    };

}
