"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.directive("sourceLocale", ["LocalesService", directiveFun]);
};

function directiveFun(LocalesService) {

    function link($scope, element, attributes) {

        LocalesService.list().then(function (locales) {
            $scope.locales = locales;
        });

        $scope.$watch('source', function (source) {
            var sourceLocaleId = undefined;

            if (source && source.Prototype)
                sourceLocaleId = source.Prototype.locale;
            else if (source && source.Current)
                sourceLocaleId = source.Current.locale;

            $scope.localeInfo = _.find($scope.locales, function (l) {
                return l.id == sourceLocaleId;
            });
        })
    }

    return {
        restrict: "E",
        link: link,
        scope: {
            source: '=src'
        },
        template: require("./source-locale-directive.pug")
    };
}