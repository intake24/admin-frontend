'use strict';

module.exports = function(app) {
    require('./current-item-service')(app);
    require('./food-data-reader-service')(app);
    require('./food-data-writer-service')(app);
    require('./problems-service')(app);
    require('./shared-data-service')(app);
    require('./user-food-data-service')(app);
};