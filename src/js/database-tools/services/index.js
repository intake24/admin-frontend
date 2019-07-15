"use strict";

module.exports = function (app) {
    require("./database-tools.service")(app);
    require("./food-composition-tables.service")(app);
    require("./derive-locale.service")(app);
};
