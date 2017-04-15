/**
 * Created by Tim Osadchiy on 18/03/2017.
 */

"use strict";

module.exports = function (app) {
    require("./survey-manager.controller")(app);
    require("./survey-manager-new/survey-manager-new.directive")(app);
    require("./survey-manager-list/survey-manager-list.directive")(app);
    require("./survey-manager-list/survey-manager-icon/survey-manager-icon.directive")(app);
    require("./survey-view/survey-view.directive")(app);
    require("./survey.service")(app);
    require("./survey-edit-form/survey-edit-form.directive")(app);
};
