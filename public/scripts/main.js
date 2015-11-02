var api_base_url = 'http://api-test.intake24.co.uk/';
var locale = 'en';

var app = angular.module('app', []);

app.service("fetchCategoriesService", function($rootScope) {
    this.broadcast = function() { $rootScope.$broadcast("fetchCategories")}
    this.listen = function(callback) { $rootScope.$on("fetchCategories", callback)}
})

$(document).ready(function() {
	$('#flash-dismiss-btn').click(function() {
		hideMessage();
	});
});

function showMessage(message, type) {
	$('.flash-message #message').html(message);
	$('.flash-message').removeClass('success warning danger').addClass(type).addClass('active');
	setTimeout(function() {hideMessage()}, 2000);
}

function hideMessage() {
	$('.flash-message').removeClass('active');
}