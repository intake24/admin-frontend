'use strict';

module.exports = function (app) {
    app.factory('SharedData', [serviceFun]);
};

function serviceFun() {
    return {
        estimationMethods: [{'name': gettext('As served'), 'slug': 'as-served'}, {
            'name': gettext('Guide Image'),
            'slug': 'guide-image'
        }, {'name': gettext('Drink scale'), 'slug': 'drink-scale'}, {
            'name': gettext('Standard portion'),
            'slug': 'standard-portion'
        }, {'name': gettext('Cereal'), 'slug': 'cereal'}, {
            'name': gettext('Milk on cereal'),
            'slug': 'milk-on-cereal'
        }, {'name': gettext('Milk in a hot drink'), 'slug': 'milk-in-a-hot-drink'}, {
            'name': gettext('Pizza'),
            'slug': 'pizza'
        }],
        cerealTypes: [{'name': gettext('Hoop'), 'slug': 'hoop'}, {
            'name': gettext('Flake'),
            'slug': 'flake'
        }, {'name': gettext('Rice krispie'), 'slug': 'rkris'}],
        currentItem: new Object(),
        originalCode: new Object(),
        foodGroups: new Object(),
        nutrientTables: Array(),
        selectedFoodGroup: new Object(),
        allCategories: Array(),
        topLevelCategories: Array(),
        treeData: new Object(),
        portionSizes: new Object()
    }
}
