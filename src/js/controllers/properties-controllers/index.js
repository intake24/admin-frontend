'use strict';

module.exports = function(app) {

    require('./associated-food-controller')(app);
    require('./categories-controller')(app);
    require('./portion-size-controller')(app);
    require('./portion-size-item-controller')(app);
    require('./properties-controller')(app);

};