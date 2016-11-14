'use strict';

var _ = require('underscore');

var findNodeInTreeFactory = function ($scope, $q, foodDataReader, packer, loadChildrenDeferred) {

    // FIXME: Can there be two nodes with the same code but different types (food, category)?

    function findNodeInTree(code, type) {

        var match = {type: type, code: code},
            deferred = $q.defer();

        // First check if the node is one of the root categories
        var targetNode = _.findWhere($scope.rootCategories, match);

        if (targetNode) {
            deferred.resolve(targetNode);
        } else {
            getParentBranch(code, type).then(function (allCategories) {
                lookInTree(deferred, allCategories, match);
            });
        }

        return deferred.promise;
    }

    function getParentBranch(code, type) {
        var allParentCategoriesDeferred = null;

        if (type == "food") {
            allParentCategoriesDeferred = foodDataReader.getFoodAllCategories(code);
        } else if (type == "category") {
            allParentCategoriesDeferred = foodDataReader.getCategoryAllCategories(code);
        }

        return allParentCategoriesDeferred;
    }

    function lookInTree(deferred, parentCategories, match) {
        var parentCategoryCodes = _.map(parentCategories, function (c) {
            return c.code;
        });

        if (parentCategoryCodes.length == 0) {
            // Check the uncategorised foods
            lookInUncategorised(match, deferred);
        } else {
            lookInBranch(deferred, $scope.rootCategories, parentCategoryCodes, match);
        }
    }

    function lookInUncategorised(match, deferred) {
        foodDataReader.getUncategorisedFoods().then(function (foods) {
            $scope.rootCategories[0].open = true;
            $scope.rootCategories[0].children = _.map(foods, packer.unpackFoodHeader);
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