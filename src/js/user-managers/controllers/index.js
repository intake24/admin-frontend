/**
 * Created by Tim Osadchiy on 11/11/2016.
 */

'use strict';

module.exports = function(app) {
    require("./user-manager-admins")(app);
    require("./user-manager-respondents")(app);
};
