/**
 * Created by Tim Osadchiy on 09/11/2016.
 */

'use strict';

module.exports = function(app) {
    require("./drawers-service")(app);
    require("./http-request-interceptor")(app);
    require("./locales-service")(app);
    require("./message-service")(app);
    require("./modal-service")(app);
    require("./packer-service")(app);
    require("./user-request-service")(app);
    require("./user-state-service")(app);
    require("./nutrient-types")(app);
    require("./admin-users-service")(app);
    require("./nutrient-tables")(app);
    require("./password-reset-service")(app);
};