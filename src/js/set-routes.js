'use strict';

module.exports = function (app) {

    var routes = {
        foodExplorer: "/",
        imageGalleryRoute: '/galleries',
        imageGalleryMain: "/galleries/main",
        imageGalleryAsServed: "/galleries/as-served",
        userManagerRoute: '/users',
        userManagerRespondents: '/users/respondents',
        userManagerAdmins: '/users/admins',
        surveyFeedback: '/survey-feedback'
    };

    app.constant('appRoutes', routes);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when(routes.foodExplorer, {
                template: require("./explorer/templates/index.pug"),
                controller: 'MainController'
            })
            .when(routes.imageGalleryMain, {
                template: require("./image-gallery/templates/image-gallery-main.pug"),
                controller: 'ImageGalleryMain'
            })
            .when(routes.imageGalleryAsServed, {
                template: require("./image-gallery/templates/image-gallery-as-served.pug"),
                controller: 'ImageGalleryAsServed'
            })
            .when(routes.imageGalleryRoute, {
                redirectTo: routes.imageGalleryMain
            })
            .when(routes.userManagerAdmins, {
                template: require("./user-managers/controllers/user-manager-admins/index.html"),
                controller: 'UserManagerAdmins'
            })
            .when(routes.userManagerRespondents, {
                template: require("./user-managers/controllers/user-manager-respondents/index.html"),
                controller: 'UserManagerRespondents'
            })
            .when(routes.surveyFeedback, {
                template: require("./survey-feedback/survey-feedback.pug"),
                controller: 'SurveyFeedbackController'
            })
            .when(routes.userManagerRoute, {
                redirectTo: routes.userManagerRespondents
            })
            .otherwise({
                redirectTo: routes.foodExplorer
            });
    }]);
};