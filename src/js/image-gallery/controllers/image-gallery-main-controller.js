/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function(app) {
    app.controller('ImageGalleryMain', ["$scope", "ImageService", controllerFun]);
};

function controllerFun($scope, ImageService) {

    $scope.images = [];

    ImageService.all().then(function(data) {
        $scope.images = data;
    });

}
