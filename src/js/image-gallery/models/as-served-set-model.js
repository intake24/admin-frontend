/**
 * Created by Tim Osadchiy on 24/10/2016.
 */

'use strict';

module.exports = AsServedSetModel;

function AsServedSetModel(id, description, deleted, images) {
    this.id = id;
    this.newId = this.id;
    this.description = description;
    this.newDescription = this.description;
    this.images = images;
    this.loading = false;
    this.edited = false;
    this.selected = false;
    this.deleted = deleted || false;
}

AsServedSetModel.prototype.edit = function() {
    this.edited = true;
};

AsServedSetModel.prototype.acceptChanges = function() {
    this.id = this.newId;
    this.description = this.newDescription;
    this.edited = false;
};

AsServedSetModel.prototype.cancelChanges = function() {
    this.newId = this.id;
    this.newDescription = this.description;
    this.edited = false;
};

AsServedSetModel.prototype.getItemSelected = function() {
    return !this.loading && this.selected;
};

AsServedSetModel.prototype.getItemDeselected = function() {
    return !this.loading && !this.selected;
};
