/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

module.exports = function (app) {
    app.controller("ImageGalleryGuided", ["$scope", controllerFun]);
};

function controllerFun($scope) {

    $scope.searchQuery = "";

    $scope.sampleImageSrcs = [
        "https://intake24.s3-eu-west-1.amazonaws.com/test/images/source/thumbnails/image_maps/danish_wienerbroed/990c5ffd-99c8-426f-b0cc-511322c6d2a2.jpg"
    ];

}
