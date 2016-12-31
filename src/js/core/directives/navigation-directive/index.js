/**
 * Created by Tim Osadchiy on 31/12/2016.
 */

"use strict";

module.exports = function (app) {
    app.directive("navigationDirective", ["$location", "LocalesService", "appRoutes", directiveFun]);
};

function directiveFun($location, LocalesService, appRoutes) {

    function controller(scope, element, attributes) {

        scope.menuItems = {
            foodExplorer: {
                href: appRoutes.foodExplorer.pattern,
                collapsed: true,
                active: false
            },
            imageGalleries: {
                href: appRoutes.imageGalleryRoute.pattern,
                collapsed: true,
                active: false
            },
            imageGalleryMain: {
                href: appRoutes.imageGalleryMain.pattern,
                active: false,
                parent: "imageGalleries"
            },
            imageGalleryAsServed: {
                href: appRoutes.imageGalleryAsServed.pattern,
                active: false,
                parent: "imageGalleries"
            },
            userManager: {
                href: appRoutes.userManagerRoute.pattern,
                collapsed: true,
                active: false
            },
            userManagerAdmins: {
                href: appRoutes.userManagerAdmins.pattern,
                active: false,
                parent: "userManager"
            },
            userManagerRespondents: {
                href: appRoutes.userManagerRespondents.pattern,
                active: false,
                parent: "userManager"
            }
        };

        scope.toggleItem = function (itemName) {
            scope.menuItems[itemName].collapsed = !scope.menuItems[itemName].collapsed;
        };

        scope.$watch(function () {
            return LocalesService.list();
        }, function (event) {
            scope.locales = LocalesService.list();
        });

        scope.currentLocale = LocalesService.current();

        scope.$on("$routeChangeSuccess", setActiveRoute);

        function setActiveRoute() {
            for (var i in scope.menuItems) {
                scope.menuItems[i].active = false;
                if ($location.$$path == scope.menuItems[i].href) {
                    scope.menuItems[i].active = true;
                    if (scope.menuItems[i].parent) {
                        scope.menuItems[scope.menuItems[i].parent].active = true;
                        scope.menuItems[scope.menuItems[i].parent].collapsed = false;
                    }
                }
            }
        }

    }

    return {
        restrict: "E",
        link: controller,
        scope: {},
        template: require("./navigation-directive.pug")
    };
}
