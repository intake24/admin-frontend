// Fixme: gettext
require("./gettext")();

require("angular");
require("angular-sanitize");
require("angular-animate");
require("angular-touch");
require("angular-ui-bootstrap");
require("angular-cookies");
require("ui-select");
require("angular-route");

var moduleRequirements = ["ngCookies", "ui.bootstrap", "ngSanitize", "ngAnimate", "ngTouch", "ui.select", "ngRoute"],
    app = angular.module("intake24.admin", moduleRequirements);

require("./core")(app);
require("./explorer")(app);
require("./image-gallery")(app);
require("./set-routes")(app);

window.api_base_url = process.env.API_BASE_URL;