'use strict';

module.exports = function(app) {
    require('../../shared/controllers/admin-controller')(app);
    require('../../shared/controllers/auth-controller')(app);
    require('../../shared/controllers/messages-controller')(app);
    require('./image-gallery-navigation-controller')(app);
    require('./image-gallery-main-controller')(app);
    require('./image-gallery-as-served-controller')(app);
};