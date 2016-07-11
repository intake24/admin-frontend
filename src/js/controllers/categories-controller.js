'use strict';

module.exports = function (app) {
    app.controller('CategoriesController', ['$scope', 'DrawersService', function ($scope, DrawersService) {
        controllerFun.call($scope, DrawersService);
    }]);
};

function controllerFun(DrawersService) {

    this.showParentCategoriesDrawer = function () {
        DrawersService.drawerManageCategories.open();
    };

}