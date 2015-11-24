var api_base_url = 'http://api-test.intake24.co.uk/';
var token = '';

var showingFlashMessage = false;

var app = angular.module('app', ['ngRoute', 'ngCookies']);

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      // $locationProvider.html5Mode(true);
      $routeProvider
      .when("/dashboard", { templateUrl: "partials/index.jade", controller: "ExplorerController" });
    }
]);

app.service("expandPropertiesService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("expandProperties")}
    this.listen = function(callback) { $rootScope.$on("expandProperties", callback)}
})

app.service("fetchCategoriesService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("fetchCategories")}
    this.listen = function(callback) { $rootScope.$on("fetchCategories", callback)}
})

app.service("getPropertiesService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("getProperties")}
    this.listen = function(callback) { $rootScope.$on("getProperties", callback)}
})

app.directive('jfbFormModel', function() {
    'use strict';

    return {
        restrict: 'A',
        require: 'form',
        compile: function(element, attr) {
            var inputs = element.find('input');
            for (var i = 0; i < inputs.length; i++){
                var input = inputs.eq(i);
                if (input.attr('name')) {
                    input.attr('ng-model', attr.jfbFormModel + '.' + input.attr('name'));
                }
            }
        }
    };
});

app.filter('custom', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value, key) {
      var actual = ('' + value).toLowerCase();
      if (actual.indexOf(expected) !== -1) {
        result[key] = value;
      }
    });
    return result;
  }
});

// Serving method filters

app.filter('serving-image-set-filter', function () {  
   return function(inputs, filterValues) {
      var output = [];
      angular.forEach(inputs, function (input) {
        if (filterValues.indexOf(input.id) !== -1)
            output.push(input);
       });
       return output;
   };
});

app.factory('SharedData', function () {
    return {
      locales: [{'language':'Arabic', 'locale':'ar_AE', 'changed':false}, {'language':'English', 'locale':'en_GB', 'changed':false}],
      locale: {'language':'English', 'locale':'en_GB', 'changed':false},
      estimationMethods: [{'name':'As served', 'slug':'as-served'}, {'name':'Guide Image', 'slug':'guide-image'}, {'name':'Drink scale', 'slug':'drink-scale'}, {'name':'Standard portion', 'slug':'standard-portion'}, {'name':'Cereal', 'slug':'cereal'}, {'name':'Milk on cereal', 'slug':'milk-on-cereal'}, {'name':'Milk in a hot drink', 'slug':'milk-in-a-hot-drink'}, {'name':'Pizza', 'slug':'pizza'}],
      currentItem: new Object(),
      originalCode: new Object(),
      foodGroups: new Object(), 
      selectedFoodGroup: new Object(),
      allCategories: new Object(),
      treeData: new Object(),
      portionSizes: new Object()
    }
});

function showMessage(message, type) {

    if ($('.flash-message').hasClass('active')) {
        
        setTimeout(function() { showMessage(message, type); }, 500);

    } else {

        $('.flash-message #message').html(message);
        $('.flash-message').removeClass('success warning danger').addClass(type).addClass('active');
        setTimeout(function() { hideMessage(); }, 1500);
    }
}

function hideMessage() {
	$('.flash-message').removeClass('active');
}