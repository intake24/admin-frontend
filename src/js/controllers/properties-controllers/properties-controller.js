/* Controller responsible for the property editor on the right-hand side of
 * the page
 */

'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('PropertiesController',
        ['$scope', 'CurrentItem', 'SharedData', 'FoodDataReader',
            'FoodDataWriter', 'UserFoodData', 'Packer', '$q', 'MessageService', 'Locales',
            controllerFun]);
};

function controllerFun($scope, currentItem, sharedData, foodDataReader, foodDataWriter, userFoodData,
                       packer, $q, MessageService, LocalesService) {

    $scope.sharedData = sharedData;

    function clearData() {
        // A snapshot of the initial item definition.
        // Loaded from the server when the currentItem changes.
        // Used to determine if anything changed to avoid making unneeded API calls.
        $scope.originalItemDefinition = null;

        // Current state of the selected item's properties.
        // Loaded from the server when the currentItem changes,
        // then bound to page controls and can be edited.
        $scope.itemDefinition = null;

        // A snapshot of the initial parent categories state.
        // Loaded from the server when the currentItem changes.
        // Used to generate add/remove category API calls when the item is saved.
        $scope.originalParentCategories = null;

        // Current state of the selected item's parent categories list.
        // Can be edited using the "Manage categories" drawer.
        $scope.parentCategories = null;

        // Local view of the current food/category in the current locale for debugging
        $scope.localFoodData = null;

        $scope.localFoodDataSources = null;

        $scope.localViewOpen = false;

        // Override disabled state for footer buttons, e.g. while the update async
        // request is pending
        $scope.forceDisabledButtons = false;

        // Used to select whether the new item actions are used or the update actions
        $scope.newItem = false;

        $scope.codeIsValid = false;
        $scope.codeIsInvalid = false;
        $scope.portionSizeIsValid = true;
    }

    clearData();

    // Currently selected item's header.
    // Used for reference and should not be changed in this controller.
    $scope.currentItem = null;

    // List of all food groups. Loaded once on controller instantiation.
    $scope.foodGroups = null;

    // List of all nutrient code tables. Loaded once on controller instantiation.
    $scope.nutrientCodeSection = {
        tables: null,
        dropDownOpened: false,
        filteredTables: function () {
            if (!$scope.itemDefinition) {
                return this.tables;
            }
            return _.filter(this.tables, function (item) {
                return $scope.itemDefinition.local.nutrientTableCodes[item.id] == undefined;
            });
        },
        toggleDropDown: function () {
            this.dropDownOpened = !this.dropDownOpened;
        },
        addTable: function (id) {
            this.dropDownOpened = false;
            $scope.itemDefinition.local.nutrientTableCodes[id] = "";
        },
        removeTable: function (id) {
            delete $scope.itemDefinition.local.nutrientTableCodes[id];
        },
        buttonDisabled: function () {
            return this.filteredTables().length == 0;
        }
    };

    $scope.parentCategoriesChanged = function () {
        var changes = parentCategoryChanges();
        return ((changes.add_to.length + changes.remove_from.length) > 0);
    };

    $scope.notValid = function () {
        return $scope.codeIsInvalid || !$scope.portionSizeIsValid ||
            $scope.itemDefinition.main.englishDescription == '';
    };

    $scope.$watch('itemDefinition.main.code', function () {
        if ($scope.itemDefinition == null) {
            return;
        }
        checkCode();
    });

    $scope.$on('intake24.admin.food_db.NewItemCreated', function (event, newItem, header, parentNode) {
        $scope.currentItem = header;
        $scope.originalItemDefinition = newItem;
        $scope.itemDefinition = angular.copy(newItem);
        $scope.originalParentCategories = [];
        $scope.parentCategories = (parentNode.code == "$UNCAT") ? [] : [parentNode];
        $scope.newItem = true;
    });

    $scope.$on('intake24.admin.food_db.CurrentItemChanged', function (event, newItem) {
        // This is just the basic header received from the tree control
        // Editable data will be stored in itemDefinition
        $scope.currentItem = newItem;
        $scope.newItem = false;
        reloadData();
    });

    $scope.$on('intake24.admin.food_db.CurrentItemUpdated', function (event, updateEvent) {
        $scope.currentItem = updateEvent.header;
        reloadData();
    });

    $scope.$on("intake24.admin.LoggedIn", function (event) {
        reloadFoodGroups();
        reloadNutrientCodeTables();
    });

    $scope.$watch("itemChanged()", function (event) {
        currentItem.setChangedState($scope.itemChanged());
    });

    function reloadData() {
        clearData();

        if ($scope.currentItem) {
            disableButtons();

            $q.all(loadBasicData(), loadParentCategories(), loadLocalData())
                .finally(function () {
                    enableButtons();
                });
        }
    }

    function loadBasicData() {

        if ($scope.currentItem.type == 'category') {
            return foodDataReader.getCategoryDefinition($scope.currentItem.code, LocalesService.current()).then(
                function (definition) {
                    $scope.itemDefinition = packer.unpackCategoryDefinition(definition);
                    $scope.originalItemDefinition = angular.copy($scope.itemDefinition);
                });
        } else if ($scope.currentItem.type == 'food') {
            return foodDataReader.getFoodDefinition($scope.currentItem.code, LocalesService.current()).then(
                function (definition) {
                    $scope.itemDefinition = packer.unpackFoodDefinition(definition);
                    $scope.originalItemDefinition = angular.copy($scope.itemDefinition);
                });
        }
    }

    function loadParentCategories() {

        function unpackCategories(categories) {
            $scope.parentCategories = _.map(categories, packer.unpackCategoryHeader);
            $scope.originalParentCategories = angular.copy($scope.parentCategories);
        }

        if ($scope.currentItem.type == 'food')
            return foodDataReader.getFoodParentCategories($scope.currentItem.code).then(unpackCategories);
        else if ($scope.currentItem.type == 'category')
            return foodDataReader.getCategoryParentCategories($scope.currentItem.code).then(unpackCategories);
    }

    function loadLocalData() {
        if ($scope.currentItem.type == 'food') {
            return userFoodData.getFoodDataWithSources($scope.currentItem.code).then(
                function (data) {
                    $scope.localFoodData = data[0];
                    $scope.localFoodDataSources = data[1];
                },
                function (response) {
                    if (response.code == 404) {
                        // 404 is expected and means that local food data is not defined
                        $scope.localFoodData = null;
                    } // anything else is an error
                    else return $q.reject(response);
                });
        }
    }

    function reloadFoodGroups() {
        foodDataReader.getFoodGroups().then(
            function (groups) {
                $scope.foodGroups = _.map(groups, packer.unpackFoodGroup);
            });
    }

    function reloadNutrientCodeTables() {
        foodDataReader.fetchNutrientTables().then(function (tables) {
            $scope.nutrientCodeSection.tables = tables;
        });
    }

    function exists(categoryList, categoryHeader) {
        for (var i = 0; i < categoryList.length; i++) {
            if (categoryList[i].code == categoryHeader.code)
                return true;
        }
        return false;
    }

    function parentCategoryChanges() {
        if ($scope.parentCategories && $scope.originalParentCategories)
            return {
                add_to: _.filter($scope.parentCategories, function (pc) {
                    return !exists($scope.originalParentCategories, pc);
                }),
                remove_from: _.filter($scope.originalParentCategories, function (cpc) {
                    return !exists($scope.parentCategories, cpc);
                })
            };
        else
            return {
                add_to: [],
                remove_from: []
            };
    }

    function checkCode() {
        var code = $scope.itemDefinition.main.code;

        if (code != "" && code == $scope.originalItemDefinition.main.code) {
            $scope.codeIsValid = false;
            $scope.codeIsInvalid = false;
            return;
        }
        if (code.length < 4 || code.length > 8) {
            $scope.codeIsValid = false;
            $scope.codeIsInvalid = true;
            return;
        }

        var deferred = ($scope.currentItem.type == 'food') ? foodDataWriter.checkFoodCode(code) : foodDataWriter.checkCategoryCode(code);

        deferred.then(
            function (codeValid) {
                $scope.codeIsValid = codeValid;
                $scope.codeIsInvalid = !codeValid;
            });

    }

    function disableButtons() {
        $scope.forceDisabledButtons = true;
    }

    function enableButtons() {
        $scope.forceDisabledButtons = false;
    }

    // Returns a single deferred for all the necessary category calls
    function updateParentCategories() {
        var changes = parentCategoryChanges();

        var addRequests = _.map(changes.add_to, function (c) {
            if ($scope.currentItem.type == 'food')
                return foodDataWriter.addFoodToCategory(c.code, $scope.itemDefinition.main.code);
            else if ($scope.currentItem.type == 'category')
                return foodDataWriter.addCategoryToCategory(c.code, $scope.itemDefinition.main.code);
        });

        var deleteRequests = _.map(changes.remove_from, function (c) {
            if ($scope.currentItem.type == 'food')
                return foodDataWriter.removeFoodFromCategory(c.code, $scope.itemDefinition.main.code);
            else if ($scope.currentItem.type == 'category')
                return foodDataWriter.removeCategoryFromCategory(c.code, $scope.itemDefinition.main.code);
        });

        // $q.all is sequence: Array[Future[_]] => Future[Array[_]]
        return $q.all(addRequests.concat(deleteRequests));
    }

    $scope.categoryBasicDefinitionChanged = function () {
        if ($scope.originalItemDefinition && $scope.itemDefinition)
            return !angular.equals(packer.packCategoryBasicDefinition($scope.originalItemDefinition.main), packer.packCategoryBasicDefinition($scope.itemDefinition.main));
        else
            return false;
    }

    $scope.categoryLocalDefinitionChanged = function () {
        if ($scope.originalItemDefinition && $scope.itemDefinition)
            return !angular.equals(packer.packCategoryLocalDefinition($scope.originalItemDefinition.local), packer.packCategoryLocalDefinition($scope.itemDefinition.local));
        else
            return false;
    }

    $scope.foodBasicDefinitionChanged = function () {
        if ($scope.originalItemDefinition && $scope.itemDefinition) {
            var packedOriginalBasic = packer.packFoodBasicDefinition($scope.originalItemDefinition.main);
            var packedCurrentBasic = packer.packFoodBasicDefinition($scope.itemDefinition.main);
            return !angular.equals(packedOriginalBasic, packedCurrentBasic);
        }
        else
            return false;
    }

    $scope.foodLocalDefinitionChanged = function () {
        if ($scope.originalItemDefinition && $scope.itemDefinition) {
            var packedOriginalLocal = packer.packFoodLocalDefinition($scope.originalItemDefinition.local);
            var packedCurrentLocal = packer.packFoodLocalDefinition($scope.itemDefinition.local);
            return !angular.equals(packedOriginalLocal, packedCurrentLocal);
        }
        else
            return false;
    }

    $scope.foodChanged = function () {
        return $scope.foodBasicDefinitionChanged() || $scope.foodLocalDefinitionChanged() || $scope.parentCategoriesChanged();
    }

    $scope.categoryChanged = function () {
        return $scope.categoryBasicDefinitionChanged() || $scope.categoryLocalDefinitionChanged() || $scope.parentCategoriesChanged();
    }

    $scope.itemChanged = function () {
        if ($scope.newItem)
            return false;
        else if ($scope.currentItem) {
            if ($scope.currentItem.type == 'food')
                return $scope.foodChanged();
            else if ($scope.currentItem.type == 'category')
                return $scope.categoryChanged();
        } else
            return false;
    }

    $scope.localDescriptionModel = function (description) {
        if (arguments.length == 1) {
            if (description.length > 0) {
                $scope.itemDefinition.local.localDescription.defined = true;
                $scope.itemDefinition.local.localDescription.value = description;
            } else {
                $scope.itemDefinition.local.localDescription.defined = false;
                $scope.itemDefinition.local.localDescription.value = null;
            }
        } else {
            if ($scope.itemDefinition != null && $scope.itemDefinition.local.localDescription.defined)
                return $scope.itemDefinition.local.localDescription.value;
            else
                return "";
        }
    }

    $scope.updateCategory = function () {
        disableButtons();

        updateCategoryBase()
            .then(function () {
                return updateParentCategories();
            })
            .then(function () {
                return updateCategoryLocal();
            })
            .then(
                function () {
                    MessageService.showMessage(gettext('Category updated'), 'success');
                    notifyItemUpdated();
                },
                function (response) {
                    MessageService.showMessage(gettext('Failed to update category'), 'danger');
                    // Check if this was caused by a 409, and show a better message
                    console.error(response);

                    notifyItemUpdated();
                });
    }

    function createUpdateEvent() {
        return {
            header: {
                type: $scope.currentItem.type,
                code: $scope.itemDefinition.main.code,
                englishDescription: $scope.itemDefinition.main.englishDescription,
                localDescription: $scope.itemDefinition.local.localDescription,
                doNotUseInThisLocale: $scope.itemDefinition.local.doNotUseInThisLocale,
                displayName: $scope.itemDefinition.local.localDescription.defined ? $scope.itemDefinition.local.localDescription.value : $scope.itemDefinition.main.englishDescription
            },
            originalCode: $scope.originalItemDefinition.main.code,
            parentCategories: _.map($scope.parentCategories, function (cat) {
                return cat.code;
            }),
        };
    }

    function notifyItemUpdated() {
        var updateEvent = createUpdateEvent();
        updateEvent.newItem = $scope.newItem;
        currentItem.itemUpdated(updateEvent);
    }

    // These functions return a future/promise/deferred (see https://docs.angularjs.org/api/ng/service/$q)
    // that will generate an async HTTP request to update the basic/local food
    // record if required.
    // Will return a dummy 'true' value if no changes are detected.
    // Resulting value is not important, but HTTP errors must be handled further.

    function updateFoodBase() {
        if ($scope.foodBasicDefinitionChanged()) {
            console.log($scope.itemDefinition);
            var packed = packer.packFoodBasicDefinition($scope.itemDefinition.main);
            return foodDataWriter.updateFoodBase($scope.originalItemDefinition.main.code, packed)
        } else {
            return $q.when(true);
        }
    }

    function updateFoodLocal() {
        if ($scope.foodLocalDefinitionChanged()) {
            var packed = packer.packFoodLocalDefinition($scope.itemDefinition.local);
            return foodDataWriter.updateFoodLocal($scope.itemDefinition.main.code, packed);
        } else {
            return $q.when(true);
        }
    }

    function updateCategoryBase() {
        if ($scope.categoryBasicDefinitionChanged()) {
            var packed = packer.packCategoryBasicDefinition($scope.itemDefinition.main);
            return foodDataWriter.updateCategoryBase($scope.originalItemDefinition.main.code, packed)
        } else {
            return $q.when(true);
        }
    }

    function updateCategoryLocal() {
        if ($scope.categoryLocalDefinitionChanged()) {
            var packed = packer.packCategoryLocalDefinition($scope.itemDefinition.local);
            return foodDataWriter.updateCategoryLocal($scope.itemDefinition.main.code, packed);
        } else {
            return $q.when(true);
        }
    }

    $scope.updateFood = function () {
        disableButtons();

        updateFoodBase()
            .then(function () {
                return updateParentCategories();
            })
            .then(function () {
                return updateFoodLocal();
            })
            .then(
                function () {
                    MessageService.showMessage(gettext('Food updated'), 'success');
                    notifyItemUpdated();
                },
                function (response) {
                    MessageService.showMessage(gettext('Failed to update food'), 'danger');
                    // Check if this was caused by a 409, and show a better message
                    console.error(response);

                    notifyItemUpdated();
                });
    }

    $scope.discardFoodChanges = function () {
        reloadData();
        MessageService.showMessage(gettext('Changes discarded'), 'success');
    }

    $scope.saveNewFood = function () {
        var packed = packer.packNewFoodDefinition($scope.itemDefinition);

        // FIXME: this really needs better error handling when the base record
        // is able to be created, but the parent categories then fail to update

        foodDataWriter.createNewFood(packed)
            .then(function () {
                return updateParentCategories();
            })
            .then(function () {
                MessageService.showMessage(gettext('New food added'), 'success');
                notifyItemUpdated();
            }, function (response) {
                MessageService.showMessage(gettext('Failed to add new food'), 'danger');
                // Check if this was caused by a 409, and show a better message
                console.error(response);
            });
    }

    $scope.cancelNewFood = function () {
        currentItem.setCurrentItem(null);
    }

    $scope.saveNewCategory = function () {
        var packed = packer.packNewCategoryDefinition($scope.itemDefinition);

        // FIXME: this really needs better error handling when the base record
        // is able to be created, but the parent categories then fail to update

        foodDataWriter.createNewCategory(packed)
            .then(function () {
                return updateParentCategories();
            })
            .then(function () {
                MessageService.showMessage(gettext('New category added'), 'success');
                notifyItemUpdated();
            }, function (response) {
                MessageService.showMessage(gettext('Failed to add new category'), 'danger');
                // Check if this was caused by a 409, and show a better message
                console.error(response);
            });
    }

    $scope.cancelNewCategory = function () {
        currentItem.setCurrentItem(null);
    }

    $scope.deleteItem = function () {
        currentItem.delete();
    }
}