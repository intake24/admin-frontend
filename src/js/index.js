require("./polyfills")();

// Fixme: gettext
require("./gettext")();

require("angular");
require("textangular/dist/textAngular-sanitize.min");
require("textangular");
require("angular-animate");
require("angular-touch");
require("angular-ui-bootstrap");
require("angular-cookies");
require("ui-select");
require("angular-route");
require("bootstrap-ui-datetime-picker");

var moduleRequirements = ["ngCookies", "ui.bootstrap", "ngAnimate", "ngTouch",
        "ui.select", "ngRoute", "ngSanitize", "textAngular", "ui.bootstrap.datetimepicker"],
    app = angular.module("intake24.admin", moduleRequirements);

require("./core")(app);
require("./explorer")(app);
require("./image-gallery")(app);
require("./user-managers")(app);
require("./survey-manager")(app);
require("./survey-feedback")(app);
require("./welcome/welcome.controller")(app);
require("./set-routes")(app);
require("./textangular-config")(app);
require("./bootstrap-ui-datetime-picker-config")(app);

window.api_base_url = process.env.API_BASE_URL;