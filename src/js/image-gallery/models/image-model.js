/**
 * Created by Tim Osadchiy on 24/10/2016.
 */

'use strict';

module.exports = ImageModel;

function ImageModel(id, src, tags) {
    this.id = id;
    this.src = src;
    this.tags = tags || [];
    this.loading = false;
    this.selected = false;
    this.disabled = false;
}

ImageModel.prototype.getItemSelected = function() {
    return !this.loading && this.selected;
};

ImageModel.prototype.getItemDeselected = function() {
    return !this.loading && !this.selected;
};
