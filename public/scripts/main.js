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

app.factory('SharedData', function () {
    return {
        locales: [{'language':'Arabic', 'locale':'ar_AE', 'changed':false}, {'language':'English', 'locale':'en_GB', 'changed':false}],
        locale: {'language':'English', 'locale':'en_GB', 'changed':false},
    	currentItem: new Object(),
        originalCode: new Object(),
    	foodGroups: new Object(), 
    	selectedFoodGroup: new Object(),
        allCategories: new Object(),
        treeData: new Object()
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