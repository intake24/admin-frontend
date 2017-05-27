'use strict';

module.exports = function(app) {
    require('./current-item-service')(app);
    require('./food-service')(app);
    require('./shared-data-service')(app);
    require('./user-food-data-service')(app);
    require('./explorer-to-properties.service')(app);
};