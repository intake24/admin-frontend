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
        drawerAssociatedFood: DrawerStateFactory(),
        imageDrawer: DrawerStateFactory(),
        userMangerDrawer: DrawerStateFactory()
    };
}

function DrawerStateFactory() {
    var isOpen = false,
        value = undefined,
        valueSetListeners = [],
        DrawerState = function () {
        };

    DrawerState.prototype.open = function () {
        document.body.classList.add("no-scroll");
        isOpen = true;
    };
    DrawerState.prototype.close = function () {
        document.body.classList.remove("no-scroll");
        isOpen = false;
    };
    DrawerState.prototype.getOpen = function () {
        return isOpen;
    };
    DrawerState.prototype.setValue = function (val) {
        value = val;
        valueSetListeners.forEach(function(fn) {
            fn(val);
        });
    };
    DrawerState.prototype.getValue = function (val) {
        return value;
    };
    DrawerState.prototype.onValueSet = function (fn) {
        valueSetListeners.push(fn);
    };
    DrawerState.prototype.offValueSet = function (fn) {
        if (fn) {
            var i = valueSetListeners.indexOf(fn);
            valueSetListeners.splice(i, 1);
        } else {
            valueSetListeners.length = 0;
        }
    };

    return new DrawerState();

}