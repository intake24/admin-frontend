'use strict';

module.exports = function (app) {
    app.service('DrawersService', [serviceFun]);
};

function serviceFun() {

    return {
        drawerManageCategories: DrawerStateFactory(),
        drawerAsServedImageSet: DrawerStateFactory(),
        drawerGuideImage: DrawerStateFactory(),
        drawerDrinkware: DrawerStateFactory(),
        drawerAssociatedFood: DrawerStateFactory()
    };
}

function DrawerStateFactory() {
    var isOpen = false,
        value = undefined,
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

    return new DrawerState();

}