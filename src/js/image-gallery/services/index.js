'use strict';

module.exports = function(app) {
    require('../../shared/services/locale-data-service')(app);
    require('../../shared/services/locales-service')(app);
    require('../../shared/services/http-request-interceptor')(app);
    require('../../shared/services/packer-service')(app);
    require('./user-state-service')(app);
    require('./user-request-service')(app);
    require('./message-service')(app);
    require('./modal-service')(app);
    require('./image-service')(app);
    require('./as-served-service')(app);
    require('./as-served-set-service')(app);
    require('./drawers-service')(app);
};