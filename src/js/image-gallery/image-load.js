/**
 * Created by Tim Osadchiy on 24/10/2016.
 */

'use strict';

module.exports = function () {
    Image.prototype.load = function (url) {
        var self = this;
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function (e) {
            var blob = new Blob([this.response]);
            self.src = window.URL.createObjectURL(blob);
        };
        xmlHTTP.onprogress = function (e) {
            self.completedPercentage = parseInt((e.loaded / e.total) * 100);
        };
        xmlHTTP.onloadstart = function () {
            self.completedPercentage = 0;
        };
        xmlHTTP.send();
    };

    Image.prototype.completedPercentage = 0;
};
