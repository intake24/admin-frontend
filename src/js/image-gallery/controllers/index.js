'use strict';

module.exports = function(app) {
    require('./image-gallery-main-controller')(app);
    require('./image-gallery-as-served-controller')(app);
    require('./image-gallery-guided.controller')(app);
    require('./image-gallery-guided-item.controller')(app);
};