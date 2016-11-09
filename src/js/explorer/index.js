'use strict';

module.exports = function (app) {
    require('./controllers')(app);
    require('./directives')(app);
    require('./services')(app);
    require('./filters')(app);
};