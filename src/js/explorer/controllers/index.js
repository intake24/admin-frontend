'use strict';

module.exports = function(app) {
    require('../../shared/controllers/admin-controller')(app);
    require('../../shared/controllers/auth-controller')(app);
    require('./explorer-controller/index')(app);
    require('../../shared/controllers/messages-controller')(app);
    require('./navigation-controller')(app);
    require('./search-controller')(app);

    require('./drawers-controllers/index')(app);
    require('./properties-controllers/index')(app);
};