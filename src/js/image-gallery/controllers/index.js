'use strict';

module.exports = function(app) {
    require('./image-gallery-main-controller')(app);
    require('./image-gallery-as-served-controller')(app);
};