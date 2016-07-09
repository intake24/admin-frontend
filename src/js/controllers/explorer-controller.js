'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('ExplorerController',
        ['$scope', 'SharedData', 'Problems', 'CurrentItem', 'FoodDataReader', 'FoodDataWriter',
            'Packer', '$q', '$rootScope', 'MessageService', controllerFun]);
};

function controllerFun($scope, sharedData, problems, currentItem, foodDataReader,
                       foodDataWriter, packer, $q, $rootScope, MessageService) {

    // Load shared data
    $scope.SharedData = sharedData;

    $scope.rootCategories = [];

    $scope.selectedNode = null;

    $scope.$on("intake24.admin.LoggedIn", function (event) {
        reloadRootCategoriesDeferred();
    });

    $scope.$on("intake24.admin.food_db.CurrentItemUpdated", function (event, updateEvent) {
        var selectedNodeRemoved = false;
        // parentNode can be null (for root category nodes)
        function processNodes(nodes, parentNode) {
            var index = -1;

            _.each(nodes, function (node, i) {
                if (node.code == updateEvent.originalCode && node.type == updateEvent.header.type) {
                    _.extend(nodes[i], updateEvent.header);
                    index = i;
                    // Update problems
                    var n = nodes[i];
                    while (n) {
                        loadProblemsForNodeDeferred(n);
                        n = n.parentNode;
                    }
                }

                if (node.type == 'category' && node.children && node.open)
                // Performance: should be tail recursion, no real need to keep index on the stack
                    processNodes(node.children, node);
            });

            // If the node matching the update event is in the current node list
            if (index > -1) {

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
                }
            }
        }

        processNodes($scope.rootCategories, null);

        if (selectedNodeRemoved || updateEvent.newItem)
            makeVisibleAndSelect(updateEvent.header);
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
            version: "",
            code: "",
            englishDescription: "New food",
            groupCode: 0,
            attributes: {
                readyMealOption: {defined: false, value: null},
                sameAsBeforeOption: {defined: false, value: null},
                reasonableAmount: {defined: false, value: null},
            },
            localData: {
                version: {defined: false, value: null},
                localDescription: {defined: false, value: null},
                nutrientTableCodes: [],
                portionSize: []
            }
        }

        var header = {
            type: "food",
            code: newFood.code,
            englishDescription: newFood.englishDescription,
            localDescription: newFood.localData.localDescription,
            displayName: newFood.englishDescription
        }

        $rootScope.$broadcast("intake24.admin.food_db.NewItemCreated", newFood, header, parentNode);

    });

    $scope.$on("intake24.admin.food_db.AddNewCategory", function (event, updateEvent) {

        var parentNode = angular.copy(parentCategoryNodeForNewItem());

        var newCategory = {
            version: "",
            code: "",
            englishDescription: "New category",
            isHidden: false,
            attributes: {
                readyMealOption: {defined: false, value: null},
                sameAsBeforeOption: {defined: false, value: null},
                reasonableAmount: {defined: false, value: null},
            },
            localData: {
                version: {defined: false, value: null},
                localDescription: {defined: false, value: null},
                portionSize: []
            }
        }

        var header = {
            type: "category",
            code: newCategory.code,
            englishDescription: newCategory.englishDescription,
            localDescription: newCategory.localData.localDescription,
            displayName: newCategory.englishDescription
        }

        $scope.$broadcast("intake24.admin.food_db.NewItemCreated", newCategory, header, parentNode);

    });

    $scope.$on("intake24.admin.food_db.CloneFood", function (event) {
        var parentNode = angular.copy(parentCategoryNodeForNewItem());
        var item = currentItem.getCurrentItem();

        if (item && item.type == 'food') {
            foodDataReader.getFoodDefinition(item.code)
                .then(function (targetFoodData) {
                    return foodDataReader.getFoodParentCategories(item.code)
                        .then(function (parentCategories) {
                            var unpacked = packer.unpackFoodDefinition(targetFoodData);
                            unpacked.englishDescription = "Copy of " + unpacked.englishDescription;
                            var newFoodDef = packer.packNewFoodDefinition(unpacked);

                            return foodDataWriter.createNewFoodWithTempCode(newFoodDef)
                                .then(function (newCode) {
                                    var newLocalData = angular.copy(targetFoodData.local);
                                    newLocalData.version = [];
                                    newLocalData.localDescription = newLocalData.localDescription.length == 1 ? [gettext("Copy of") + " " + newLocalData.localDescription[0]] : [];
                                    return foodDataWriter.updateFoodLocal(newCode, newLocalData)
                                        .then(function () {
                                            return $q.all(_.map(parentCategories, function (c) {
                                                return foodDataWriter.addFoodToCategory(c.code, newCode)
                                            }));
                                        })
                                        .then(function () {
                                            MessageService.showMessage("Food cloned", "success");
                                            makeVisibleAndSelect({
                                                type: "food",
                                                code: newCode,
                                                englishDescription: targetFoodData.englishDescription,
                                                localDescription: targetFoodData.local.localDescription,
                                                displayName: targetFoodData.local.localDescription.defined ? targetFoodData.local.localDescription.value : targetFoodData.englishDescription
                                            });
                                        })
                                })
                        })
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
                    deferred = foodDataWriter.deleteCategory(item.code);
                else if (item.type == 'food')
                    deferred = foodDataWriter.deleteFood(item.code);

                deferred.then(function () {
                    clearSelection();

                    var removeFromNodes = function (nodes, node) {
                        var targetNode = _.findWhere(nodes, {code: node.code}),
                            i = nodes.indexOf(targetNode);
                        if (i > -1) {
                            var parent = targetNode.parentNode;
                            nodes.splice(i, 1);
                            while (parent) {
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
    }

    $scope.removeFromCategory = function () {

    }

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
    }

    $scope.hasProblems = function (node) {
        if (node.type == 'food')
            return (node.problems != null && node.problems.length > 0);
        else if (node.type == 'category')
            return (node.recursiveProblems != null &&
            (node.recursiveProblems.categoryProblems.length > 0 ||
            node.recursiveProblems.foodProblems.length > 0));
    }

    function loadProblemsForNodeDeferred(node) {
        if ((node.type == 'category') && ( node.code != '$UNCAT'))
            return problems.getCategoryProblemsRecursive(node.code).then(function (problems) {
                node.recursiveProblems = problems;
            })
        else if ((node.type == 'category') && (node.code == '$UNCAT')) {
            return foodDataReader.getUncategorisedFoods().then(function (uncategorisedFoods) {
                node.recursiveProblems = {
                    foodProblems: _.map(_.take(uncategorisedFoods, 10), function (food) {
                        var unpacked = packer.unpackFoodHeader(food);
                        return {
                            foodName: unpacked.displayName,
                            foodCode: unpacked.code,
                            problemCode: "food_not_categorised"
                        }
                    }),
                    categoryProblems: []
                }
            });
        }
        else if (node.type == 'food')
            return problems.getFoodProblems(node.code).then(function (problems) {
                node.problems = problems;
            });
        else
            return $q.reject("Node has no type tag -- probably incorrect argument");
    }

    function reloadRootCategoriesDeferred() {
        return foodDataReader.getRootCategories().then(function (categories) {
            $scope.rootCategories = _.map(categories, packer.unpackCategoryHeader);

            $scope.rootCategories.unshift(
                {
                    displayName: "Uncategorised foods", //FIXME: use localised string
                    code: "$UNCAT",
                    type: "category",
                    children: []
                }
            );

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
            childrenDeferred = foodDataReader.getUncategorisedFoods().then(function (foods) {
                return _.map(foods, packer.unpackFoodHeader);
            });
        else
            childrenDeferred = foodDataReader.getCategoryContents(node.code).then(function (contents) {
                var subcategories = _.map(contents.subcategories, packer.unpackCategoryHeader);
                var foods = _.map(contents.foods, packer.unpackFoodHeader);
                return subcategories.concat(foods);
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

    function findNodeInTree(node) {

        var match = {type: node.type, code: node.code};

        // First check if the node is one of the root categories
        var targetNode = _.findWhere($scope.rootCategories, match);

        if (targetNode) {
            return $q.when(targetNode);
        } else {
            // Try to find the node in the tree
            var allParentCategoriesDeferred = null;

            if (node.type == "food") {
                allParentCategoriesDeferred = foodDataReader.getFoodAllCategories(node.code);
            } else if (node.type == "category") {
                allParentCategoriesDeferred = foodDataReader.getCategoryAllCategories(node.code);
            }

            return allParentCategoriesDeferred.then(function (allCategories) {

                var allCategoryCodes = _.map(allCategories, function (c) {
                    return c.code;
                });

                if (allCategoryCodes.length == 0) {
                    // Check the uncategorised foods

                    return foodDataReader.getUncategorisedFoods().then(function (foods) {
                        $scope.rootCategories[0].open = true;
                        $scope.rootCategories[0].children = _.map(foods, packer.unpackFoodHeader);
                        targetNode = _.findWhere($scope.rootCategories[0].children, match);
                        if (targetNode)
                            return $q.when(targetNode);
                        else
                            return $q.reject("Failed to find selected node in the food tree");
                    });
                } else {
                    var category = _.find($scope.rootCategories, function (cnode) {
                        return _.contains(allCategoryCodes, cnode.code)
                    });

                    if (category) {
                        return loadChildrenDeferred(category).then(function () {
                            category.open = true;

                            var targetNode = _.findWhere(category.children, match);

                            if (targetNode)
                                return $q.when(targetNode);
                            else
                                return find(_.filter(category.children, function (n) {
                                    return n.type == "category"
                                }));
                        });
                    } else {
                        return $q.reject("Failed to find selected node in the food tree");
                    }
                }
            });
        }
    }

    function scrollTo(element, to, duration) {
        if (duration <= 0) return;
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;

        setTimeout(function () {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop === to) return;
            scrollTo(element, to, duration - 10);
        }, 10);
    }

    function makeVisibleAndSelect(node) {
        findNodeInTree(node).then(function (n) {
            clearSelection();
            selectNode(n);
            setTimeout(function () {
                var targetElement = document.querySelector("#food-list-col ul a.active"),
                    container = document.getElementById("food-list-col"),
                    to = targetElement.offsetTop - document.querySelector("header").offsetHeight - 5;
                scrollTo(container, to, 250);
            }, 0);
        });
    }

    $scope.uncategorisedFoodsExist = function () {
        return $scope.uncategorisedFoods.length > 0;
    }

    function selectNode(node) {
        if (!confirmSwitchToAnotherItem()) {
            return;
        }
        clearSelection();

        $scope.selectedNode = node;
        $scope.selectedNode.selected = true;

        if ($scope.selectedNode.type == 'category') {
            $scope.selectedNode.open = !$scope.selectedNode.open;
            if ($scope.selectedNode.open)
                loadChildren(node);
        }

        // Don't show properties for the uncategorised foods node
        if (($scope.selectedNode.type != 'category') || ($scope.selectedNode.code != '$UNCAT'))
            currentItem.setCurrentItem($scope.selectedNode);
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

    $scope.nodeClicked = function (node) {
        selectNode(node);
    }

    $scope.searchResultSelected = function ($event, node) {
        makeVisibleAndSelect(node);
    }

    $scope.discardCategoryChanges = function () {

        $scope.SharedData.currentItem.code = $scope.SharedData.originalCode;
        $scope.fetchProperties();

        MessageService.showMessage(gettext('Changes discarded'), 'success');
    }
}
