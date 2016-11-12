'use strict';

module.exports = function (app) {

    var routes = {
        foodExplorer: {
            pattern: '/',
            template: require("./explorer/templates/index.jade")
        },
        imageGalleryRoute: {
            pattern: '/galleries',
        },
        imageGalleryMain: {
            pattern: '/galleries/main',
            template: require("./image-gallery/templates/image-gallery-main.jade")
        },
        imageGalleryAsServed: {
            pattern: '/galleries/as-served',
            template: require("./image-gallery/templates/image-gallery-as-served.jade")
        },
        userManagerRoute: {
            pattern: '/users'
        },
        userManagerRespondents: {
            pattern: '/users/respondents',
            template: require("./user-managers/controllers/user-manager-respondents/index.html")
        },
        userManagerAdmins: {
            pattern: '/users/admins',
            template: require("./user-managers/controllers/user-manager-admins/index.html")
        },
    };

    app.constant('appRoutes', routes);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when(routes.foodExplorer.pattern, {
                template: routes.foodExplorer.template,
                controller: 'MainController'
            })
            .when(routes.imageGalleryMain.pattern, {
                template: routes.imageGalleryMain.template,
                controller: 'ImageGalleryMain'
            })
            .when(routes.imageGalleryAsServed.pattern, {
                template: routes.imageGalleryAsServed.template,
                controller: 'ImageGalleryAsServed'
            })
            .when(routes.imageGalleryRoute.pattern, {
                redirectTo: routes.imageGalleryMain.pattern
            })
            .when(routes.userManagerAdmins.pattern, {
                template: routes.userManagerAdmins.template,
                controller: 'UserManagerAdmins'
            })
            .when(routes.userManagerRespondents.pattern, {
                template: routes.userManagerRespondents.template,
                controller: 'UserManagerRespondents'
            })
            .when(routes.userManagerRoute.pattern, {
                redirectTo: routes.userManagerRespondents.pattern
            })
            .otherwise({
                redirectTo: routes.foodExplorer.pattern
            });
    }]);
};