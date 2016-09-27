'use strict';

module.exports = function(app) {
    app.controller('AssociatedFoodController', ['$scope', 'DrawersService', function($scope, DrawersService) {
        controllerFun.call($scope, DrawersService);
    }]);
};

function controllerFun(DrawersService) {

    var selectedItem = null;
    var self = this;

    this.addAssociatedFood = function () {
        this.$parent.itemDefinition.local.associatedFoods.push({
            mainFood: false,
            linkAsMain: false,
            promptText: ""
        })
    };

    this.removeAssociatedFood = function (item) {
        var i = this.$parent.itemDefinition.local.associatedFoods.indexOf(item);
        this.$parent.itemDefinition.local.associatedFoods.splice(i, 1);
    };

    this.showAssociatedFoodDrawer = function (obj) {
        selectedItem = obj;
        DrawersService.drawerAssociatedFood.open();
    };

    this.$watch('itemDefinition', function() {
        console.log(self.itemDefinition);
    });

    this.$watch(function() {
        return DrawersService.drawerAssociatedFood.getValue();
    }, function() {
        if (selectedItem) {
          selectedItem.foodOrCategory = DrawersService.drawerAssociatedFood.getValue();
    }
  });
}
