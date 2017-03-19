// Fixme: gettext
require("./gettext")();

require("angular");
require("textangular/dist/textAngular-sanitize.min");
require("textAngular");
require("angular-animate");
require("angular-touch");
require("angular-ui-bootstrap");
require("angular-cookies");
require("ui-select");
require("angular-route");

var moduleRequirements = ["ngCookies", "ui.bootstrap", "ngAnimate", "ngTouch",
        "ui.select", "ngRoute", "ngSanitize", "textAngular"],
    app = angular.module("intake24.admin", moduleRequirements);

require("./core")(app);
require("./explorer")(app);
require("./image-gallery")(app);
require("./user-managers")(app);
require("./survey-manager")(app);
require("./survey-feedback")(app);
require("./set-routes")(app);
require("./textangular-config")(app);

window.api_base_url = process.env.API_BASE_URL;