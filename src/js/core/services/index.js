/**
 * Created by Tim Osadchiy on 09/11/2016.
 */

'use strict';

module.exports = function(app) {
    require("./drawers-service")(app);
    require("./http-request-interceptor")(app);
    require("./locale-data-service")(app);
    require("./locales-service")(app);
    require("./message-service")(app);
    require("./modal-service")(app);
    require("./packer-service")(app);
    require("./user-request-service")(app);
    require("./user-state-service")(app);
};