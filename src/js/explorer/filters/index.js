'use strict';

module.exports = function(app) {
    require('./selected-category-filter')(app);
    require('./category-filter')(app);
    require('./as-served-filter')(app);
    require('./guide-image-filter')(app);
    require('./drink-scale-filter')(app);
    require('./serving-image-set-filter')(app);
    require('../../shared/filters/ng-text-cut-filter')(app);
};