/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.controller('ImageGalleryNavigationController', ["$scope", "$location", "appRoutes", controllerFun]);
};

function controllerFun($scope, $location, appRoutes) {

    $scope.menuItems = [
        {name: window.gettext("image_gallery_main_gallery"), href: appRoutes.imageGalleryMain.pattern},
        {name: window.gettext("image_gallery_as_served"), href: appRoutes.imageGalleryAsServed.pattern}
    ];

    $scope.getItemIsActive = function (item) {
        return item.href == $location.path();
    };

}
