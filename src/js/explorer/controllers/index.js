'use strict';

module.exports = function(app) {
    require('./explorer-controller/index')(app);
    require('./search-controller')(app);

    require('./drawers-controllers')(app);
    require('./properties-controllers')(app);
    require('./main-controller')(app);
};