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
        "http://api-test.intake24.co.uk/intake24-images/source/thumbnails/image_maps/danish_toerkager/4d02e4f9-9de5-4455-a3da-e2a95109ffd8.jpg",
        "http://api-test.intake24.co.uk/intake24-images/source/thumbnails/image_maps/danish_herring/89991b81-1a24-4c65-8c31-4fc6c2b4c57c.jpg",
        "http://api-test.intake24.co.uk/intake24-images/source/thumbnails/image_maps/danish_french_pastry/5fbc1942-612b-4ede-8ce2-f8b03fdf8fa0.jpg",
        "http://api-test.intake24.co.uk/intake24-images/source/thumbnails/image_maps/danish_crispbread/ffca8b12-38e4-41e3-b63f-d6cea9750fab.jpg",
        "http://api-test.intake24.co.uk/intake24-images/source/thumbnails/image_maps/danish_sweets/ffdc2ea8-b312-4286-abe7-353207796f16.jpg",
        "http://api-test.intake24.co.uk/intake24-images/source/thumbnails/image_maps/choc_bites/1466eea2-f71a-4103-b0ba-6f03f047bcad.jpg",
        "http://api-test.intake24.co.uk/intake24-images/source/thumbnails/image_maps/cereal_bars_unwrapped/3bae605a-e326-4ca2-8544-a7ab90c16a2e.jpg",
        "http://api-test.intake24.co.uk/intake24-images/source/thumbnails/image_maps/cereal_bars_wrapped/c5cdc943-91b3-440c-879e-6bfa80b89f24.jpg",
        "http://api-test.intake24.co.uk/intake24-images/source/thumbnails/image_maps/bhaji/29055ece-538e-479d-a3bc-3a364e10e171.jpg",
        "http://api-test.intake24.co.uk/intake24-images/source/thumbnails/image_maps/danish_wienerbroed/0ff9d008-bcfb-4b91-990c-04ef53e782f5.jpg"
    ];

}
