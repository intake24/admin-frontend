"use strict";

module.exports = function (app) {
    require("./food-composition.controller")(app);
    require("./fct-edit.controller")(app);
    require("./directives/food-composition-table/food-composition-table.directive")(app);
};