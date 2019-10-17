"use strict";

module.exports = function (app) {
    require("./services")(app);
    require("./food-composition")(app);
    require("./food-frequency.controller")(app);
    require("./derive-locale/derive-locale.controller")(app);
    require("./recalculate-nutrients/recalculate-nutrients.controller")(app);
    require("./directives/task-status/task-status.directive")(app);
};
