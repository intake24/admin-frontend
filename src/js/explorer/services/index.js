'use strict';

module.exports = function(app) {
    require('../../shared/services/locale-data-service')(app);
    require('../../shared/services/locales-service')(app);
    require('../../shared/services/http-request-interceptor')(app);
    require('../../shared/services/packer-service')(app);
    require('./problems-service')(app);
    require('./food-data-reader-service')(app);
    require('./food-data-writer-service')(app);
    require('./user-food-data-service')(app);
    require('./current-item-service')(app);
    require('./drawers-service')(app);
    require('./shared-data-service')(app);
    require('./user-state-service')(app);
    require('./user-request-service')(app);
    require('./message-service')(app);
    require('./modal-service')(app);
};