'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.controller('SearchController', ['$scope', '$timeout', 'FoodDataReader', 'Packer', controllerFun]);
};

function controllerFun($scope, $timeout, foodDataReader, packer) {

    var queryTimeout = 500,
        timeoutPromise;

    $scope.searchResults = null;
    $scope.searchResultsAreVisible = false;
    $scope.query = '';
    $scope.focused = false;
    $scope.getActive = function () {
        return this.query != '' || this.focused;
    };
    $scope.setFocused = function () {
        this.focused = true;
    };
    $scope.setUnfocused = function () {
        this.focused = false;
    };

    $scope.$watch('query', function () {
        $timeout.cancel(timeoutPromise);
        $timeout(performFoodSearch, queryTimeout);
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

        foodDataReader.searchCategories(query).then(function (categories) {
                $scope.searchResults = $scope.searchResults.concat(_.map(categories, packer.unpackCategoryHeader));
            },
            $scope.handleError);

        foodDataReader.searchFoods(query).then(function (foods) {
                $scope.searchResults = $scope.searchResults.concat(_.map(foods, packer.unpackFoodHeader));
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