"use strict";

module.exports = function (app) {
    app.directive("foodCompositionTable", ["$interval", "$location",
        function ($interval, $location) {
            return {
                restrict: "E",
                scope: {
                    fct: "="
                },
                link: function (scope, element, attr) {
                },
                template: require("./food-composition-table.directive.html")
            }
        }
    ]);
};