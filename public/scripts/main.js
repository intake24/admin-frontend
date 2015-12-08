var api_base_url = 'http://api-test.intake24.co.uk/';
var token = '';

var showingFlashMessage = false;

var app = angular.module('app', ['ngCookies']);

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

// app.filter('custom', function() {
//   return function(input, search) {
//     if (!input) return input;
//     if (!search) return input;
//     var expected = ('' + search).toLowerCase();
//     var result = {};
//     angular.forEach(input, function(value, key) {
//       var actual = ('' + value).toLowerCase();
//       if (actual.indexOf(expected) !== -1) {
//         result[key] = value;
//       }
//     });
//     return result;
//   }
// });

// // Serving method filters

// app.filter('serving-image-set-filter', function () {  
//    return function(inputs, filterValues) {
//       var output = [];
//       angular.forEach(inputs, function (input) {
//         if (filterValues.indexOf(input.id) !== -1)
//             output.push(input);
//        });
//        return output;
//    };
// });

// Shared data definition

app.factory('SharedData', function () {
    return {
      locales: [{'language':gettext('Arabic'), 'locale_language':'العربية', 'locale':'ar', 'intake_locale':'ar_AE', 'flag':'ar', 'changed':false}, {'language':gettext('English'), 'locale_language':'English', 'locale':'en', 'intake_locale':'en_GB', 'flag':'england','changed':false}],
      locale: {'language':gettext('English'), 'locale':'en', 'intake_locale':'en_GB', 'changed':false},
      estimationMethods: [{'name':gettext('As served'), 'slug':'as-served'}, {'name':gettext('Guide Image'), 'slug':'guide-image'}, {'name':gettext('Drink scale'), 'slug':'drink-scale'}, {'name':gettext('Standard portion'), 'slug':'standard-portion'}, {'name':gettext('Cereal'), 'slug':'cereal'}, {'name':gettext('Milk on cereal'), 'slug':'milk-on-cereal'}, {'name':gettext('Milk in a hot drink'), 'slug':'milk-in-a-hot-drink'}, {'name':gettext('Pizza'), 'slug':'pizza'}],
      cerealTypes: [{'name':gettext('Hoop'), 'slug':'hoop'}, {'name':gettext('Flake'), 'slug':'flake'}, {'name':gettext('Rice krispie'), 'slug':'rice-krispie'}],
      currentItem: new Object(),
      originalCode: new Object(),
      foodGroups: new Object(), 
      selectedFoodGroup: new Object(),
      allCategories: new Object(),
      treeData: new Object(),
      portionSizes: new Object()
    }
});