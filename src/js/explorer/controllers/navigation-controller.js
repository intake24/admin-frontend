'use strict';

module.exports = function(app) {
    app.controller('NavigationController', ["$rootScope", "$scope", "Locales", "CurrentItem", controllerFun]);
};

function controllerFun($rootScope, $scope, locales, currentItem) {

    // FIXME: What are these for?
    $scope.manage_foods_active = true;
    $scope.manage_categories_active = true;

    $scope.$watch(function () {
        return locales.list();
    }, function (event) {
        $scope.locales = locales.list();
    });

    $scope.currentLocale = locales.current();

    $scope.currentItem = currentItem;

    $scope.setLocale = function (intake24_locale, ui_locale) {
        document.location = '/' + intake24_locale + '/' + ui_locale;
    };

    $scope.addNewFood = function () {
        $rootScope.$broadcast('intake24.admin.food_db.AddNewFood');
    };

    $scope.addNewCategory = function () {
        $rootScope.$broadcast('intake24.admin.food_db.AddNewCategory');
    };

    $scope.cloneFoodEnabled = function () {
        var curItem = $scope.currentItem.getCurrentItem();
        return (curItem && curItem.type == 'food');
    };

    $scope.cloneFood = function () {
        $rootScope.$broadcast('intake24.admin.food_db.CloneFood');
    };

    $scope.deleteItemEnabled = function () {
        return $scope.currentItem.getCurrentItem();
    };

    $scope.deleteItem = function () {
        if ($scope.deleteItemEnabled())
            $scope.currentItem.delete();
    };

}
