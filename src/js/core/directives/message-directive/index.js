"use strict";

module.exports = function (app) {
    app.directive("messagesDirective", ["MessageService", directiveFun]);
};

function directiveFun(MessageService) {

    function controller(scope, element, attributes) {

        scope.visible = false;
        scope.message = "";
        scope.class = "";

        scope.hide = function () {
            MessageService.hideMessage();
        };

        scope.$watchCollection(function () {
            return [MessageService.getActive(), MessageService.getMessageText(), MessageService.getMessageType()];
        }, function () {
            scope.visible = MessageService.getActive();
            scope.message = MessageService.getMessageText();
            scope.class = MessageService.getMessageType();
        })

    }

    return {
        restrict: "E",
        link: controller,
        scope: {},
        template: require("./message-directive.pug")
    };
}