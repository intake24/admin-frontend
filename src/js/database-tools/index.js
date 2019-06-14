/**
 * Created by Tim Osadchiy on 16/02/2017.
 */

"use strict";

module.exports = function (app) {
    require("./survey-feedback.controller")(app);
    require("./services")(app);
    //require("./directives")(app);
};
