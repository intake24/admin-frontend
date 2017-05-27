/**
 * Created by Tim Osadchiy on 29/12/2016.
 */

"use strict";

module.exports = function (app) {
    require("./nutrient-table-record-code-select/nutrient-table-record-code-select.directive")(app);
    require("./message-directive")(app);
    require("./auth-directive")(app);
    require("./navigation-directive")(app);
    require('./file-button-directive')(app);
};
