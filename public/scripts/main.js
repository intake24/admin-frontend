var api_base_url = 'http://api-test.intake24.co.uk/';
var token = '';
var locale = 'en';

var messageStack = [];

var app = angular.module('app', []);

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
    messageStack.push({message: message, type: type});

    showMessages();

    // $.each(messageStack, function(index, value) {
    //     $('.flash-message #message').html(message);
    //     $('.flash-message').removeClass('success warning danger').addClass(type).addClass('active');
    //     setTimeout(function() { hideMessage(); }, 2000);
    // });
}

function showMessages() {
    var item = messageStack.pop();
    $('.flash-message #message').html(item.message);
    $('.flash-message').removeClass('success warning danger').addClass(item.type).addClass('active');
    setTimeout(function() {
        hideMessage();
        if (messageStack.length > 0) {
            showMessages();
        };
    }, 2000);
}

function hideMessage() {
	$('.flash-message').removeClass('active');
}