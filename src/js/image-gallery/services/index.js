'use strict';

module.exports = function(app) {
    require('./user-state-service')(app);
    require('./user-request-service')(app);
    require('./message-service')(app);
    require('./modal-service')(app);
    require('../../shared/services/http-request-interceptor')(app);
};