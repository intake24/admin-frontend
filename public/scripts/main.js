var app = angular.module('app', []);
var api_base_url = 'http://api-test.intake24.co.uk/';
var locale = 'en';

app.service("fetchCategoriesService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("fetchCategories")}
    this.listen = function(callback) { $rootScope.$on("fetchCategories", callback)}
})

$(document).ready(function() {

	// Click handler on menu button to toggle sidebar
	$('#sidebar-button').click(function() { $('.sidebar').toggleClass('active') });
});