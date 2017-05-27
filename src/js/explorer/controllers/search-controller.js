'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('SearchController', ['$scope', '$rootScope', '$routeParams', '$timeout', 'LocalesService',
        'FoodService', 'UserStateService', controllerFun]);
};

function controllerFun($scope, $rootScope, $routeParams, $timeout, LocalesService, FoodService, UserStateService) {

    var queryTimeout = 500,
        timeoutPromise;

    $scope.searchResults = null;
    $scope.searchResultsAreVisible = false;
    $scope.query = "";
    $scope.focused = false;
    $scope.queryTextDirection = "";

    $scope.getActive = function () {
        return this.query != '' || this.focused;
    };

    $scope.addNewFood = function () {
        $rootScope.$broadcast('intake24.admin.food_db.AddNewFood');
    };

    $scope.addNewCategory = function () {
        $rootScope.$broadcast('intake24.admin.food_db.AddNewCategory');
    };

    $scope.getFoodTextDirection = function (food) {
        if (food.localDescription && food.localDescription.defined) {
            return $scope.queryTextDirection;
        }
    };

    $scope.$watch('query', function (oldValue, newValue) {
        if (newValue) {
            $timeout.cancel(timeoutPromise);
            timeoutPromise = $timeout(performFoodSearch, queryTimeout);
        }
    });

    $scope.$watch(function () {
        return $scope.$parent.getTextDirection();
    }, function (newVal) {
        $scope.queryTextDirection = newVal;
    });

    $scope.$watch(function() { return $routeParams.locale; }, function (newValue) {
        $scope.currentLocale = newValue;
    });

    $scope.$watch(function() { return UserStateService.getUserInfo(); }, function (newValue) {
        $scope.currentUser = newValue;
    });

    function performFoodSearch() {
        var query = $scope.query;
        $scope.searchResults = [];

        if (query == '') {
            hideSearchResults();
            return;
        } else {
            showSearchResults();
        }

        FoodService.searchCategories($routeParams.locale, query).then(function (categories) {
                $scope.searchResults = $scope.searchResults.concat(categories);
            },
            $scope.handleError);

        FoodService.searchFoods($routeParams.locale, query).then(function (foods) {
                $scope.searchResults = $scope.searchResults.concat(foods);
            },
            $scope.handleError);
    }

    function showSearchResults() {
        $scope.$parent.explorerIsVisible = false;
        $scope.searchResultsAreVisible = true;
    }

    function hideSearchResults() {
        $scope.$parent.explorerIsVisible = true;
        $scope.searchResultsAreVisible = false;
    }

    $scope.resultClicked = function ($event, node) {
        $scope.query = '';
        hideSearchResults();

        // Defined in outer Explorer controller
        $scope.searchResultSelected($event, node);
    }

}
