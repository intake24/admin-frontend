var api_base_url = 'http://api-test.intake24.co.uk/';
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyLUI5MGU4YzFMcHhPM0N6clpsakNaS2JxbUJqaVFDUzhBNVdFXC9ObktwY2JkUnFoWEh1Vkxzc1YwaHZKZVJ5RHVqUmx3QXk1Q2U2TlhHSkRHRkg4RmJ3YXh5dlE9PSIsImkyNHAiOltdLCJpMjRyIjpbImFkbWluIl0sImlzcyI6InBsYXktc2lsaG91ZXR0ZSIsImV4cCI6MTQ0NDg1ODk1NCwiaWF0IjoxNDQ0ODE1NzU0LCJqdGkiOiI2OGIxZTMyMGViMzE1Yjk0OTEzM2JmYzAzNDEyNWViMDIwMmViNWYyOTkyNDIyNmY1MTBkZGEyMjg0NDc0ZjU3ZTZhMTM1YWE0ZGI1MDA5OWU1MzFhNTA1YjI2OGI5MzhiNDc0YWUyNTg1NGFiYzQ4MTM1ZDQ4ZDM5MTM2NTc0ZTc2ZTY2ZjY1NzVkOGExODgxMmQ4MzYyNTg0ZGVlNzI2YTlhYjY2OGU2YzNlOTU2ODBjMTgxOWZlNGVmMDM0Y2M0YzVkMzE0YjRiMzkxOGFlN2Y4MmMyMGI4Y2I5ZTliNDJiYjMwN2Q2MGRjZTMyYzYyN2RhZDAzYjBmMzE5MThmIn0.v7AR8IfbgGHYaZEiJ1DJilEiWGUnfPmLxGnsX5Aq_CU';
// var token = '';
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