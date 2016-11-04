/**
 * Created by Tim Osadchiy on 24/10/2016.
 */

'use strict';

module.exports = AsServedItemModel;

function AsServedItemModel(item) {
    this.parent = item;
    this.newSrc = item.src;
    this.newTags = item.tags;
    this.newWeight = item.weight;
    this.loading = false;
    this.edited = false;
}

AsServedItemModel.prototype.edit = function() {
    this.edited = true;
};

AsServedItemModel.prototype.acceptChanges = function() {
    this.parent.src = this.newSrc;
    this.parent.tags = this.newTags;
    this.parent.weight = this.newWeight;
    this.edited = false;
};

AsServedItemModel.prototype.cancelChanges = function() {
    this.newSrc = this.parent.src;
    this.newTags = this.parent.tags;
    this.newWeight = this.parent.weight;
    this.edited = false;
};
