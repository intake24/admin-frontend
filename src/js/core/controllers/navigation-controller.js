'use strict';

module.exports = function(app) {
    app.controller('NavigationController', ["$scope", "Locales", controllerFun]);
};

function controllerFun($scope, locales) {

    $scope.menuItemsState = {
        setLocale: false,
        galleries: false
    };

    $scope.toggleItem = function(itemName) {
        $scope.menuItemsState[itemName] = !$scope.menuItemsState[itemName];
    };

    $scope.$watch(function () {
        return locales.list();
    }, function (event) {
        $scope.locales = locales.list();
    });

    $scope.currentLocale = locales.current();

    $scope.setLocale = function (intake24_locale, ui_locale) {
        document.location = '/' + intake24_locale + '/' + ui_locale;
    };

}
