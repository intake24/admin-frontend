'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('ExplorerController',
        ['$scope', '$timeout', '$routeParams', 'SharedData', 'FoodService', 'CurrentItem',
            '$q', '$rootScope', 'MessageService', 'LocalesService', 'ExplorerToProperties',
            'UserStateService',
            controllerFun]);
};

function controllerFun($scope, $timeout, $routeParams, sharedData, FoodService, currentItem,
                       $q, $rootScope, MessageService, LocalesService, ExplorerToProperties,
                       UserStateService) {

    var findNodeInTree = require('./find-node-in-tree-factory')($scope, $q, FoodService,
        loadChildrenDeferred);

    var textDirection;

    // Load shared data
    $scope.SharedData = sharedData;
    $scope.rootCategories = [];
    $scope.selectedNode = null;
    $scope.explorerIsVisible = true;

    $scope.searchTools = {
        showLocalDescription: ExplorerToProperties.getShowLocalDescription(),
        showFoodNotUsedInLocale: false
    };

    $scope.toggleShowLocalDescription = function () {
        $scope.searchTools.showLocalDescription = !$scope.searchTools.showLocalDescription;
        ExplorerToProperties.setShowLocalDescription($scope.searchTools.showLocalDescription);
    };

    $scope.toggleShowFoodNotUsedInLocale = function () {
        $scope.searchTools.showFoodNotUsedInLocale = !$scope.searchTools.showFoodNotUsedInLocale;
    };

    $scope.getNodeDisplayName = function (node) {
        if (!$scope.searchTools.showLocalDescription) {
            return node.englishDescription;
        } else {
            return node.localDescription && node.localDescription.defined ?
                node.localDescription.value : node.englishDescription;
        }
    };

    $scope.getTextDirection = function () {
        return $scope.searchTools.showLocalDescription ? textDirection : "";
    };

    $scope.getNodeIsHidden = function (node) {
        return node.excludedFromThisLocale && !$scope.searchTools.showFoodNotUsedInLocale;
    };

    $scope.getSortedList = function (foodList) {
        return foodList.slice().sort(function (a, b) {
            if (a.type + $scope.getNodeDisplayName(a) > b.type + $scope.getNodeDisplayName(b)) {
                return 1;
            } else if (a.type + $scope.getNodeDisplayName(a) < b.type + $scope.getNodeDisplayName(b)) {
                return -1;
            } else {
                return 0;
            }
        });
    };

    $scope.$watch(function () {
        return $routeParams.locale;
    }, function (newValue) {
        $scope.currentLocale = newValue;
    });

    $scope.$watch(function () {
        return UserStateService.getUserInfo();
    }, function (newValue) {
        $scope.currentUser = newValue;
    });

    $scope.$on("intake24.admin.LoggedIn", function (event) {
        reloadRootCategoriesDeferred();
    });

    reloadRootCategoriesDeferred();

    $scope.$on("intake24.admin.food_db.CurrentItemUpdated", function (event, updateEvent) {
        var selectedNodeRemoved = false;

        // parentNode can be null (for root category nodes)
        function processNodes(nodes, parentNode) {
            var index = -1;

            _.each(nodes, function (node, i) {
                if (node.code == updateEvent.originalCode && node.type == updateEvent.header.type) {
                    _.extend(nodes[i], updateEvent.header);
                    index = i;
                }

                if (node.type == 'category' && node.children && node.open)
                // Performance: should be tail recursion, no real need to keep index on the stack
                    processNodes(node.children, node);
            });

            // If the node matching the update event is in the current node list
            if (index > -1) {

                updatePotentiallyAffectedNodes(nodes[index]);

                // Remove the node from the list if:
                //  - The node was not a root category node and it is no longer contained in the category represented by parentNode
                //  - The node was an uncategorised food node and it is no longer uncategorised (has 1+ parent categories)
                //  - The node was a root category node and it is no longer a root category (has 1+ parent categories)
                if (
                    (parentNode && (updateEvent.parentCategories.indexOf(parentNode.code) == -1)) ||
                    (parentNode && (updateEvent.parentCategories.length > 0) && (parentNode.code == '$UNCAT')) ||
                    (!parentNode && (updateEvent.header.type == 'category') && (updateEvent.parentCategories.length > 0))
                ) {
                    if (nodes[index].selected)
                        selectedNodeRemoved = true;
                    nodes.splice(index, 1);
                }
            } else {
                // Add node to the list:
                // - The node is now in the category represented by parentNode
                // - The node now has 0 parent categories and parentNode is the uncategorised categories node
                // - The node is now a root category node (is a category and has 0 parent categories)
                if (
                    (parentNode && (updateEvent.parentCategories.indexOf(parentNode.code) > -1)) ||
                    (parentNode && (updateEvent.parentCategories.length == 0) && (parentNode.code == '$UNCAT')) ||
                    (!parentNode && (updateEvent.header.type == 'category') && (updateEvent.parentCategories.length == 0))
                ) {
                    nodes.push(updateEvent.header);
                    updatePotentiallyAffectedNodes(updateEvent.header);
                }
            }
        }

        processNodes($scope.rootCategories, null);

        if (selectedNodeRemoved || updateEvent.newItem)
            makeVisibleAndSelect(updateEvent.header.code, updateEvent.header.type);
    });

    function parentCategoryNodeForNewItem() {
        if ($scope.selectedNode == null)
            return $scope.rootCategories[0];
        else if ($scope.selectedNode.type == 'category')
            return $scope.selectedNode;
        else
            return $scope.selectedNode.parentNode;
    }

    $scope.$on("intake24.admin.food_db.AddNewFood", function (event, updateEvent) {

        var parentNode = angular.copy(parentCategoryNodeForNewItem());

        var newFood = {
            main: {
                version: "",
                code: "",
                englishDescription: "New food",
                groupCode: 0,
                attributes: {
                    readyMealOption: {defined: false, value: null},
                    sameAsBeforeOption: {defined: false, value: null},
                    reasonableAmount: {defined: false, value: null},
                },
                parentCategories: [],
                localeRestrictions: $scope.currentUser.canCreateGlobalFoods() ? [] : [$scope.currentLocale]
            },
            local: {
                version: {defined: false, value: null},
                localDescription: {defined: false, value: null},
                nutrientTableCodes: [],
                portionSize: [],
                associatedFoods: [],
                brandsNames: []
            }
        };

        var header = {
            type: "food",
            code: newFood.code,
            englishDescription: newFood.englishDescription,
            localDescription: newFood.local.localDescription,
            displayName: newFood.englishDescription
        };

        $rootScope.$broadcast("intake24.admin.food_db.NewItemCreated", newFood, header, parentNode);

    });

    $scope.$on("intake24.admin.food_db.AddNewCategory", function (event, updateEvent) {

        var parentNode = angular.copy(parentCategoryNodeForNewItem());

        var newCategory = {
            main: {
                version: "",
                code: "",
                englishDescription: "New category",
                isHidden: false,
                attributes: {
                    readyMealOption: {defined: false, value: null},
                    sameAsBeforeOption: {defined: false, value: null},
                    reasonableAmount: {defined: false, value: null},
                },
                parentCategories: []
            },
            local: {
                version: {defined: false, value: null},
                localDescription: {defined: false, value: null},
                portionSize: []
            }
        }

        var header = {
            type: "category",
            code: newCategory.code,
            englishDescription: newCategory.englishDescription,
            localDescription: newCategory.local.localDescription,
            displayName: newCategory.englishDescription
        }

        $rootScope.$broadcast("intake24.admin.food_db.NewItemCreated", newCategory, header, parentNode);

    });

    $scope.$on("intake24.admin.food_db.CloneFood", function (event) {
        var item = currentItem.getCurrentItem();

        if (item && item.type == 'food') {

            var parentNode = angular.copy(parentCategoryNodeForNewItem());

            FoodService.cloneFood($routeParams.locale, item.code)
                .then(function (result) {
                    loadChildrenDeferred(parentNode).then(
                        function () {
                            MessageService.showMessage("Food cloned", "success");
                            makeVisibleAndSelect(result.clonedFoodCode, "food");
                        });
                });
        } else
            MessageService.showMessage("Select a food to clone", "warning");
    });

    $scope.$on("intake24.admin.food_db.CloneFoodAsLocal", function (event) {
        var item = currentItem.getCurrentItem();

        if (item && item.type == 'food') {

            var parentNode = angular.copy(parentCategoryNodeForNewItem());

            FoodService.cloneFoodAsLocal($routeParams.locale, item.code)
                .then(function (result) {
                    loadChildrenDeferred(parentNode).then(
                        function () {
                            MessageService.showMessage("Food cloned", "success");
                            makeVisibleAndSelect(result.clonedFoodCode, "food");
                        });
                });
        } else
            MessageService.showMessage("Select a food to clone", "warning");
    });

    $scope.$on("intake24.admin.food_db.DeleteItem", function () {
        var item = currentItem.getCurrentItem();

        if (!item)
            MessageService.showMessage(gettext("Select an item to delete"), "warning");
        else {
            if (confirm("Delete " + item.displayName + " (" + item.code + ") ?")) {
                var deferred;
                if (item.type == 'category')
                    deferred = FoodService.deleteCategory(item.code);
                else if (item.type == 'food')
                    deferred = FoodService.deleteFood(item.code);

                deferred.then(function () {
                    clearSelection();

                    var removeFromNodes = function (nodes, node) {
                        var targetNode = _.findWhere(nodes, {code: node.code}),
                            i = nodes.indexOf(targetNode);
                        if (i > -1) {
                            var parent = targetNode.parentNode;
                            nodes.splice(i, 1);
                            while (parent) {
                                console.log("Delete: reloading problems for " + parent.type + " " + parent.code);
                                loadProblemsForNodeDeferred(parent);
                                parent = parent.parentNode;
                            }
                        }
                        _.each(nodes, function (n) {
                            if (n.children) {
                                removeFromNodes(n.children, node);
                            }
                        });
                    };
                    removeFromNodes($scope.rootCategories, item);
                });

            }
        }
    });

    $scope.getText = function (s) {
        return gettext(s);
    };

    $scope.removeFromCategory = function () {

    };

    $scope.nodeMarkerClass = function (node) {
        var cls = ['fa', 'fa-fw'];

        if (node.type == 'food') {
            cls.push('fa-circle-o');
        } else
            cls.push('fa-circle');

        if ($scope.hasProblems(node))
            cls.push('problems');

        if (node.changed)
            cls.push('editing');

        return cls;
    };

    $scope.hasProblems = function (node) {
        if (node.type == 'food')
            return (node.problems != null && node.problems.length > 0);
        else if (node.type == 'category')
            return (node.recursiveProblems != null &&
            (node.recursiveProblems.categoryProblems.length > 0 ||
            node.recursiveProblems.foodProblems.length > 0));
    };

    $scope.$watch(function () {
        return $routeParams.locale;
    }, function () {
        LocalesService.getLocale($routeParams.locale).then(function (locale) {
            textDirection = locale.textDirection;
        });
    });

    function updatePotentiallyAffectedNodes(changedNode) {
        function isDescendant(node, ofNode) {
            return isAncestor(ofNode, node);
        }

        function isAncestor(node, ofNode) {
            var p = ofNode.parentNode;
            while (p) {
                if (p.code == node.code && p.type == node.type)
                    return true;
                else
                    p = p.parentNode;
            }
            return false;
        }

        function processNodes(nodes) {
            _.each(nodes, function (node) {
                if (isAncestor(changedNode, node) || isDescendant(changedNode, node)) {
                    loadProblemsForNodeDeferred(node);
                }

                if (node.type == 'category' && node.children && node.open)
                    processNodes(node.children);
            });
        }

        loadProblemsForNodeDeferred(changedNode);
        processNodes($scope.rootCategories);
    }

    function loadProblemsForNodeDeferred(node) {
        if ((node.type == 'category') && ( node.code != '$UNCAT')) {
            return FoodService.getCategoryProblemsRecursive($routeParams.locale, node.code)
                .then(function (problems) {
                    node.recursiveProblems = problems;
                });
        }
        else if ((node.type == 'category') && (node.code == '$UNCAT')) {
            return FoodService.getUncategorisedFoods($routeParams.locale).then(function (uncategorisedFoods) {
                node.recursiveProblems = {
                    foodProblems: _.map(_.take(uncategorisedFoods, 10), function (food) {
                        return {
                            foodName: food.displayName,
                            foodCode: food.code,
                            problemCode: "food_not_categorised"
                        }
                    }),
                    categoryProblems: []
                }
            });
        } else if (node.type == 'food')
            return FoodService.getFoodProblems($routeParams.locale, node.code).then(function (problems) {
                node.problems = problems;
            });
        else {
            return $q.reject("Node has no type tag -- probably incorrect argument");
        }
    }

    function reloadRootCategoriesDeferred() {
        return FoodService.getRootCategories($routeParams.locale).then(function (categories) {
            $scope.rootCategories = categories;

            return $q.all(_.map($scope.rootCategories, function (node) {
                return loadProblemsForNodeDeferred(node)
            }));
        });
    }

    function loadChildrenDeferred(node) {
        if (node.type != 'category')
            console.error("Attempt to load children of a non-category node: " + node.code);

        var childrenDeferred;

        if (node.code == "$UNCAT")
            childrenDeferred = FoodService.getUncategorisedFoods($routeParams.locale);
        else
            childrenDeferred = FoodService.getCategoryContents($routeParams.locale, node.code)
                .then(function (contents) {
                    return contents.subcategories.slice().concat(contents.foods);
                });

        return childrenDeferred.then(function (children) {
            node.children = children;
            _.each(node.children, function (n) {
                n.parentNode = node
            });
            return $q.all(_.map(node.children, function (node) {
                loadProblemsForNodeDeferred(node);
            }));
        });
    }

    function loadChildren(node) {
        node.loadingChildren = true;
        loadChildrenDeferred(node).finally(function () {
            node.loadingChildren = false;
        });
    }

    function scrollTo(element, to, duration) {
        if (duration <= 0) return;
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;

        $timeout(function () {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop === to) return;
            scrollTo(element, to, duration - 10);
        }, 10);
    }

    function makeVisibleAndSelect(code, type) {
        //Fixme. This should be a directive
        findNodeInTree($routeParams.locale, code, type).then(function (n) {
            clearSelection();
            showNodeProperties(n);
            // Timeout is set to wait for the children to be loaded and then scroll to the selected element.
            // Fixme: Timeout is bad.
            $timeout(function () {
                var targetElement = document.querySelector("#food-list-col ul span.active"),
                    container = document.querySelector("#food-list-col .food-list"),
                    to = targetElement.offsetTop - document.querySelector("header").offsetHeight - 5;
                scrollTo(container, to, 250);
            }, 250);
        });
    }

    $scope.uncategorisedFoodsExist = function () {
        return $scope.uncategorisedFoods.length > 0;
    }

    function showNodeProperties(node) {
        if (!confirmSwitchToAnotherItem()) {
            return;
        }
        clearSelection();

        $scope.selectedNode = node;
        $scope.selectedNode.selected = true;

        // Don't show properties for the uncategorised foods node
        if (($scope.selectedNode.type != 'category') || ($scope.selectedNode.code != '$UNCAT'))
            currentItem.setCurrentItem($scope.selectedNode);
    }

    function expandNode(node) {
        if (node.type == 'category') {
            node.open = !node.open;
            if (node.open) {
                loadChildren(node);
            }
        }
    }

    function clearSelection() {
        if ($scope.selectedNode)
            $scope.selectedNode.selected = false;
        $scope.selectedNode = null;
        currentItem.setCurrentItem(null);
    }

    function confirmSwitchToAnotherItem() {
        if ($scope.selectedNode == null || !$scope.selectedNode.changed) {
            return true;
        }
        var conf = confirm(gettext('discard_item_changes'));
        if (conf) {
            $scope.selectedNode.changed = false;
            return true;
        } else {
            return false;
        }
    }

    $scope.showNodeProperties = showNodeProperties;

    $scope.expandNode = expandNode;

    $scope.searchResultSelected = function ($event, node) {
        makeVisibleAndSelect(node.code, node.type);
    };

    $scope.discardCategoryChanges = function () {

        $scope.SharedData.currentItem.code = $scope.SharedData.originalCode;
        $scope.fetchProperties();

        MessageService.showMessage(gettext('Changes discarded'), 'success');
    };
}
