'use strict';

module.exports = function (app) {
    app.controller('MessagesController', ['$scope', 'MessageService', controllerFun]);
};

function controllerFun($scope, MessageService) {

    $scope.visible = false;
    $scope.message = '';
    $scope.class = '';

    $scope.$watchCollection(function() {
        return [MessageService.getActive(), MessageService.getMessageText(), MessageService.getMessageType()];
    }, function() {
        $scope.visible = MessageService.getActive();
        $scope.message = MessageService.getMessageText();
        $scope.class = MessageService.getMessageType();
    })

}