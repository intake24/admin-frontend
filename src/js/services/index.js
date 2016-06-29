'use strict';

module.exports = function(app) {
    require('./problems-service')(app);
    require('./food-data-reader-service')(app);
    require('./food-data-writer-service')(app);
    require('./user-food-data-service')(app);
    require('./locale-data-service')(app);
    require('./current-item-service')(app);
    require('./locales-service')(app);
    require('./packer-service')(app);
};