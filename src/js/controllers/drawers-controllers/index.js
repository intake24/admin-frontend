'use strict';

module.exports = function(app) {

    require('./as-served-set-controller')(app);
    require('./associated-food-drawer-controller')(app);
    require('./category-manager-controller')(app);
    require('./drinkware-controller')(app);
    require('./guide-image-controller')(app);

};