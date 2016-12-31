/**
 * Created by Tim Osadchiy on 29/12/2016.
 */

"use strict";

module.exports = function (app) {
    require("./message-directive")(app);
    require("./auth-directive")(app);
    require("./navigation-directive")(app);
};
