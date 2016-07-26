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
    app.controller('CategoryManagerController',
        ['$scope', 'FoodDataReader', 'Packer', 'DrawersService', controllerFun]);
};

function controllerFun($scope, foodDataReader, packer, DrawersService) {

    $scope.searchQuery = '';

    // The list of categories matching current search query, loaded asynchronously
    $scope.searchResults = null;

    // Fixed category list, see comment on top
    $scope.fixedCategories = [];

    $scope.isOpen = DrawersService.drawerManageCategories.getOpen();

    $scope.toggleParentCategory = function (categoryHeader) {
        var index = -1;
        for (var i= 0, l=$scope.parentCategories.length; i<l; i++) {
            if ($scope.parentCategories[i].code == categoryHeader.code) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            $scope.parentCategories.push(categoryHeader);
        } else {
            $scope.parentCategories.splice(index, 1);
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

    $scope.close = function () {
        DrawersService.drawerManageCategories.close();
    };

    $scope.$watch('searchQuery', loadSearchResults);

    $scope.$watch(function () {
        return DrawersService.drawerManageCategories.getOpen();
    }, function () {
        $scope.isOpen = DrawersService.drawerManageCategories.getOpen();
    });

    function loadSearchResults() {
        if ($scope.searchQuery == '') {
            return;
        }
        foodDataReader.searchCategories($scope.searchQuery).then(function (categories) {
                $scope.searchResults = _.map(categories, packer.unpackCategoryHeader);
            },
            $scope.handleError
        );
    }

}
