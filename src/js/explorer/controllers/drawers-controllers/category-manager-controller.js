/* Controller for the "Manage categories" drawer
 *
 *	When opened, takes a snapshot of the current parent categories from the parent
 * PropertiesController as "fixed" categories.
 *
 * Sticky categories can be toggled to add/remove them from the PropertiesController
 * parentCategory list. The sticky list is maintained so that deselected categories stay
 * on the list and can be easily re-selected.
 *
 * New categories can be added by typing in the search box. Any clicked categories
 * from the search results will be added to the sticky list for the current category
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
    $scope.stickyCategories = [];

    $scope.isOpen = DrawersService.drawerManageCategories.getOpen();

    $scope.toggleParentCategory = function (categoryHeader) {
        var index = -1;
        for (var i= 0, l=$scope.itemDefinition.main.parentCategories.length; i<l; i++) {
            if ($scope.itemDefinition.main.parentCategories[i].code == categoryHeader.code) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            $scope.itemDefinition.main.parentCategories.push(categoryHeader);
            if (!_.findWhere($scope.stickyCategories, { code : categoryHeader.code }))
              $scope.stickyCategories.push(categoryHeader);
        } else {
            $scope.itemDefinition.main.parentCategories.splice(index, 1);
        }
    };

    $scope.isInParentCategories = function (categoryHeader) {
      if ($scope.itemDefinition == null) {
        return false;
      } else {
        var parentCategories = $scope.itemDefinition.main.parentCategories;
        return _.some(parentCategories, function (header) { return header.code == categoryHeader.code; });
      }
    };

    $scope.close = function () {
        DrawersService.drawerManageCategories.close();
    };

    $scope.$watch('searchQuery', loadSearchResults);

    $scope.$watch(function () {
        return DrawersService.drawerManageCategories.getOpen();
    }, function () {
        $scope.isOpen = DrawersService.drawerManageCategories.getOpen();

        if ($scope.isOpen) {
          $scope.stickyCategories = angular.copy($scope.itemDefinition.main.parentCategories);
        } else {
          $scope.stickyCategories = [];
        }
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
