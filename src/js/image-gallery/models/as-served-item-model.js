/**
 * Created by Tim Osadchiy on 24/10/2016.
 */

'use strict';

module.exports = AsServedItemModel;

function AsServedItemModel(id, src, tags, weight, deleted) {
    this.id = id;
    this.src = src;
    this.newSrc = this.src;
    this.tags = tags || [];
    this.weight = weight || 0;
    this.newWeight = this.weight;
    this.loading = false;
    this.edited = false;
    this.selected = false;
    this.deleted = deleted || false;
}

AsServedItemModel.prototype.edit = function() {
    this.edited = true;
};

AsServedItemModel.prototype.acceptChanges = function() {
    this.src = this.newSrc;
    this.weight = this.newWeight;
    this.edited = false;
};

AsServedItemModel.prototype.cancelChanges = function() {
    this.newSrc = this.src;
    this.newWeight = this.weight;
    this.edited = false;
};

AsServedItemModel.prototype.getItemSelected = function() {
    return !this.loading && this.selected;
};

AsServedItemModel.prototype.getItemDeselected = function() {
    return !this.loading && !this.selected;
};
