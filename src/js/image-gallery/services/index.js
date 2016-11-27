'use strict';

module.exports = function(app) {
    require('./as-served-set-service')(app);
    require('./image-service')(app);
};