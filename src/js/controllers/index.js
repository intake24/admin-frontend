'use strict';

module.exports = function(app) {
    require('./as-served-set-controller')(app);
    require('./associated-food-modal-controller')(app);
    require('./category-manager-controller')(app);
    require('./drinkware-controller')(app);
    require('./explorer-controller')(app);
    require('./guide-image-controller')(app);
    require('./properties-controller')(app);
    require('./search-controller')(app);
    require('./auth-controller')(app);
    require('./navigation-controller')(app);
    require('./admin-controller')(app);
    require('./messages-controller')(app);
    require('./portion-size-controller')(app);
    require('./portion-size-item-controller')(app);
};