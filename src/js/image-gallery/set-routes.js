'use strict';

module.exports = function (app) {

    var routes = {
        imageGalleryMain: {
            pattern: '/main',
            template: "views/image-gallery/image-gallery-main.jade"
        },
        imageGalleryAsServed: {
            pattern: '/as-served',
            template: "views/image-gallery/image-as-served.jade"
        }
    };

    app.constant('appRoutes', routes);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when(routes.imageGalleryMain.pattern, {
                templateUrl: routes.imageGalleryMain.template,
                controller: 'ImageGalleryMain'
            })
            .when(routes.imageGalleryAsServed.pattern, {
                templateUrl: routes.imageGalleryAsServed.template,
                controller: 'ImageGalleryAsServed'
            })
            .otherwise({
                redirectTo: routes.imageGalleryMain.pattern
            });
    }]);
};