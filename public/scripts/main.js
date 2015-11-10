var api_base_url = 'http://api-test.intake24.co.uk/';
var token = '';
var locale = 'en';

var app = angular.module('app', []);

app.service("expandPropertiesService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("expandProperties")}
    this.listen = function(callback) { $rootScope.$on("expandProperties", callback)}
})

app.service("fetchCategoriesService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("fetchCategories")}
    this.listen = function(callback) { $rootScope.$on("fetchCategories", callback)}
})

app.factory('SharedData', function () {
    return {
    	currentItem: new Object(),
        originalCode: new Object(),
    	foodGroups: new Object(), 
    	selectedFoodGroup: new Object(),
        allCategories: new Object(),
        treeData: new Object()
    }
});

function showMessage(message, type) {
	$('.flash-message #message').html(message);
	$('.flash-message').removeClass('success warning danger').addClass(type).addClass('active');
	setTimeout(function() {hideMessage()}, 2000);
}

function hideMessage() {
	$('.flash-message').removeClass('active');
}