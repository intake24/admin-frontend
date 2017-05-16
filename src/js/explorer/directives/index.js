'use strict';

module.exports = function(app) {
    require('./jfb-form-model')(app);
    require('./source-locale-directive')(app);
};