'use strict';

module.exports = function (app) {
    app.controller('AssociatedFoodController', ['$scope', 'DrawersService', function ($scope, DrawersService) {
        controllerFun.call($scope, DrawersService);
    }]);
};

function controllerFun(DrawersService) {

    var selectedItem = null;
    var self = this;

    this.addAssociatedFood = function () {
        this.$parent.itemDefinition.local.associatedFoods.push({
            foodOrCategory: null,
            mainFood: false,
            linkAsMain: false,
            promptText: "",
            genericName: ""
        })
    };

    this.removeAssociatedFood = function (item) {
        var i = this.$parent.itemDefinition.local.associatedFoods.indexOf(item);
        this.$parent.itemDefinition.local.associatedFoods.splice(i, 1);
    };

    this.showAssociatedFoodDrawer = function (obj) {
        var callback = function (value) {
            selectedItem.foodOrCategory = value;
            DrawersService.drawerAssociatedFood.offValueSet(callback);
        };
        selectedItem = obj;
        DrawersService.drawerAssociatedFood.open();
        DrawersService.drawerAssociatedFood.onValueSet(callback);
    };

    this.$watch(function () {
        return DrawersService.drawerAssociatedFood.getValue();
    }, function () {
        if (selectedItem) {
            selectedItem.foodOrCategory = DrawersService.drawerAssociatedFood.getValue();
        }
    });
}
