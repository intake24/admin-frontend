'use strict';

var _ = require('underscore');

var findNodeInTreeFactory = function ($scope, $q, foodDataReader, loadChildrenDeferred) {

    // FIXME: Can there be two nodes with the same code but different types (food, category)?

    function findNodeInTree(locale, code, type) {

        var match = {type: type, code: code},
            deferred = $q.defer();

        // First check if the node is one of the root categories
        var targetNode = _.findWhere($scope.rootCategories, match);

        if (targetNode) {
            deferred.resolve(targetNode);
        } else {
            getParentBranch(locale, code, type).then(function (allCategories) {
                lookInTree(locale, deferred, allCategories, match);
            });
        }

        return deferred.promise;
    }

    function getParentBranch(locale, code, type) {
        var allParentCategoriesDeferred = null;

        if (type == "food") {
            allParentCategoriesDeferred = foodDataReader.getFoodAllCategories(locale, code);
        } else if (type == "category") {
            allParentCategoriesDeferred = foodDataReader.getCategoryAllCategories(locale, code);
        }

        return allParentCategoriesDeferred;
    }

    function lookInTree(locale, deferred, parentCategories, match) {
        var parentCategoryCodes = _.map(parentCategories, function (c) {
            return c.code;
        });

        if (parentCategoryCodes.length == 0) {
            // Check the uncategorised foods
            lookInUncategorised(locale, match, deferred);
        } else {
            lookInBranch(deferred, $scope.rootCategories, parentCategoryCodes, match);
        }
    }

    function lookInUncategorised(locale, match, deferred) {
        foodDataReader.getUncategorisedFoods(locale).then(function (foods) {
            $scope.rootCategories[0].open = true;
            $scope.rootCategories[0].children = foods;
            var targetNode = _.findWhere($scope.rootCategories[0].children, match);
            if (targetNode) {
                deferred.resolve(targetNode);
            } else {
                deferred.reject("Failed to find selected node in the food tree");
            }
        });
    }

    function lookInBranch(deferred, categories, parentCategoryCodes, match) {
        var category = _.find(categories, function (cnode) {
            return _.contains(parentCategoryCodes, cnode.code)
        });

        if (category) {
            loadChildrenDeferred(category).then(function () {
                category.open = true;

                var targetNode = _.findWhere(category.children, match);

                if (targetNode) {
                    deferred.resolve(targetNode);
                } else {
                    var childCategories = _.filter(category.children, function (n) {
                        return n.type == "category"
                    });
                    lookInBranch(deferred, childCategories, parentCategoryCodes, match);
                }
            });
        } else {
            deferred.reject("Failed to find selected node in the food tree");
        }
    }

    return findNodeInTree;

};

module.exports = findNodeInTreeFactory;