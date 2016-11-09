/**
 * Created by Tim Osadchiy on 09/11/2016.
 */

'use strict';

module.exports = function(app) {
    require("./controllers")(app);
    require("./filters")(app);
    require("./services")(app);
    require("./config")(app);
};
