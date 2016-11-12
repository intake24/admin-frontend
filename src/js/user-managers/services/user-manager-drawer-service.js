'use strict';

module.exports = function (app) {
    app.service('UserManagerDrawerService', [serviceFun]);
};

function serviceFun() {

    return DrawerStateFactory();
}

function DrawerStateFactory() {
    var isOpen = false,
        value = undefined,
        onSaveListener = undefined,
        DrawerState = function () {
        };

    DrawerState.prototype.open = function () {
        isOpen = true;
    };
    DrawerState.prototype.close = function () {
        isOpen = false;
    };
    DrawerState.prototype.getOpen = function () {
        return isOpen;
    };
    DrawerState.prototype.setValue = function (val) {
        value = val;
    };
    DrawerState.prototype.getValue = function () {
        return value;
    };
    DrawerState.prototype.onSave = function (fn) {
        onSaveListener = fn;
    };
    DrawerState.prototype.fireSave = function () {
        if (onSaveListener) {
            onSaveListener();
        }
    };
    DrawerState.prototype.offSave = function () {
        onSaveListener = undefined;
    };

    return new DrawerState();

}