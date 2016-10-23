/**
 * Created by Tim Osadchiy on 22/10/2016.
 */

'use strict';

module.exports = function(app) {
    app.controller('ImageGalleryMain', ["$scope", "ImageService", controllerFun]);
};

function controllerFun($scope, ImageService) {

    $scope.images = [];
    $scope.searchQuery = '';

    $scope.getFilteredImages = function() {
        return $scope.images.filter(function(image) {
            return image.tags.join(' ').search($scope.searchQuery) > -1;
        });
    };

    ImageService.all().then(function(data) {
        $scope.images = data;
    });

}
