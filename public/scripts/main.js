var api_base_url = 'http://localhost:9000/';
var token = '';

var showingFlashMessage = false;

/*setInterval(function() {

  if (($(window).height() + $(window).scrollTop()) > ($('#food-list-col').height() + $('header').height())) {
    $('.view-toggle').fadeOut();
  } else {
    $('.view-toggle').fadeIn();
  }

}, 500);*/

var app = angular.module('intake24.admin', ['ngCookies', 'ui.bootstrap', 'intake24.admin.food_db']);

app.service("fetchCategoriesService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("fetchCategories")}
    this.listen = function(callback) { $rootScope.$on("fetchCategories", callback)}
})

app.service("fetchPropertiesService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("fetchProperties")}
    this.listen = function(callback) { $rootScope.$on("fetchProperties", callback)}
})

app.service("fetchImageSetsService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("fetchImageSets")}
    this.listen = function(callback) { $rootScope.$on("fetchImageSets", callback)}
})

app.service("packCurrentItemService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("packCurrentItem")}
    this.listen = function(callback) { $rootScope.$on("packCurrentItem", callback)}
})

app.service("unpackCurrentItemService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("unpackCurrentItem")}
    this.listen = function(callback) { $rootScope.$on("unpackCurrentItem", callback)}
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


app.filter('selectedCategoryFilter', function() {

  return function(input, search) {
    var result = {};
    angular.forEach(input, function(value, key) {
      var actual = ('' + value.state).toLowerCase();
      if ((actual.indexOf('add') !== -1) || (actual.indexOf('existing') !== -1)) {
        result[key] = value;
      }
    });
    return result;
  }
});

app.filter('categoryFilter', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value, key) {
      var actual = ('' + value.englishDescription).toLowerCase();
      if (actual.indexOf(expected) !== -1) {
        result[key] = value;
      }
    });
    return result;
  }
});

app.filter('asServedFilter', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value, key) {
      var actual = ('' + value.description).toLowerCase();
      if (actual.indexOf(expected) !== -1) {
        result[key] = value;
      }
    });
    return result;
  }
});

app.filter('guideImageFilter', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value, key) {
      var actual = ('' + value.id).toLowerCase();
      if (actual.indexOf(expected) !== -1) {
        result[key] = value;
      }
    });
    return result;
  }
});

app.filter('drinkScaleFilter', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value, key) {
      var actual = ('' + value.description).toLowerCase();
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
