/**
 * Created by Tim Osadchiy on 10/11/2016.
 */

"use strict";

module.exports = function (app) {
    require("./controllers")(app);
    require("./services")(app);
    require("./directives")(app);
};
