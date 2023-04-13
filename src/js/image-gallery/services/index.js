'use strict';

module.exports = function(app) {
    require('./as-served-set-service')(app);
    require('./image-service')(app);
    require("./guide-images.service")(app);
    require("./drinkware-service")(app);
};
