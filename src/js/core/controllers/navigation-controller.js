'use strict';

module.exports = function (app) {
    app.controller('NavigationController', ["$scope", "$location", "Locales", "appRoutes", controllerFun]);
};

function controllerFun($scope, $location, locales, appRoutes) {

    $scope.menuItems = {
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

    $scope.toggleItem = function (itemName) {
        $scope.menuItems[itemName].collapsed = !$scope.menuItems[itemName].collapsed;
    };

    $scope.$watch(function () {
        return locales.list();
    }, function (event) {
        $scope.locales = locales.list();
    });

    $scope.currentLocale = locales.current();

    $scope.$on("$routeChangeSuccess", setActiveRoute);

    function setActiveRoute() {
        for (var i in $scope.menuItems) {
            $scope.menuItems[i].active = false;
            if ($location.$$path == $scope.menuItems[i].href) {
                $scope.menuItems[i].active = true;
                if ($scope.menuItems[i].parent) {
                    $scope.menuItems[$scope.menuItems[i].parent].active = true;
                    $scope.menuItems[$scope.menuItems[i].parent].collapsed = false;
                }
            }
        }
    }

}
