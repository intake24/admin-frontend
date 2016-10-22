'use strict';

var _ = require('underscore');

var findNodeInTreeFactory = function ($scope, $q, foodDataReader, packer, loadChildrenDeferred) {

    function findNodeInTree(node) {

        var match = {type: node.type, code: node.code},
            deferred = $q.defer();

        // First check if the node is one of the root categories
        var targetNode = _.findWhere($scope.rootCategories, match);

        if (targetNode) {
            deferred.resolve(targetNode);
        } else {
            getParentBranch(node).then(function (allCategories) {
                lookInTree(deferred, allCategories, match);
            });
        }

        return deferred.promise;
    }

    function getParentBranch(node) {
        var allParentCategoriesDeferred = null;

        if (node.type == "food") {
            allParentCategoriesDeferred = foodDataReader.getFoodAllCategories(node.code);
        } else if (node.type == "category") {
            allParentCategoriesDeferred = foodDataReader.getCategoryAllCategories(node.code);
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