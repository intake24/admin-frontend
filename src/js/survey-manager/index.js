/**
 * Created by Tim Osadchiy on 18/03/2017.
 */

"use strict";

module.exports = function (app) {
    require("./survey-manager.controller")(app);
    require("./survey-manager-create-modal/survey-manager-create-modal.directive")(app);
    require("./survey.service")(app);
};
