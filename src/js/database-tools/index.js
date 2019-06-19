"use strict";

module.exports = function (app) {
    require("./services")(app);
    require("./database-tools.controller")(app);
    require("./directives/task-status/task-status.directive")(app);
};