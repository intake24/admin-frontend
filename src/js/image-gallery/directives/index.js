'use strict';

module.exports = function(app) {
    require('./img-loader-directive')(app);
    require('./tag-input-directive')(app);
};