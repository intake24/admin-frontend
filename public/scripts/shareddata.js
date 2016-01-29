// Shared data definition

angular.module('intake24.admin').factory('SharedData', function () {
	return {
		locales:
		[
			{'language':gettext('Arabic'), 'locale_language':'العربية', 'locale':'ar', 'intake_locale':'ar_AE', 'flag':'ar', 'changed':false},
			{'language':gettext('English (UK)'), 'locale_language':'English (UK)', 'locale':'en', 'intake_locale':'en_GB', 'flag':'gb','changed':false},
			{'language':gettext('English (UK Chinese population)'), 'locale_language':'English (UK Chinese population)', 'locale':'en', 'intake_locale':'en_GB_cn', 'flag':'gb','changed':false},
			{'language':gettext('Portuguese'), 'locale_language':'Português', 'locale':'en', 'intake_locale':'pt_PT', 'flag':'pt','changed':false},
			{'language':gettext('Danish'), 'locale_language':'Dansk', 'locale':'en', 'intake_locale':'da_DK', 'flag':'dk','changed':false}
		],
			locale: {'language':gettext('English'), 'locale':'en', 'intake_locale':'en_GB', 'changed':false},
			estimationMethods: [{'name':gettext('As served'), 'slug':'as-served'}, {'name':gettext('Guide Image'), 'slug':'guide-image'}, {'name':gettext('Drink scale'), 'slug':'drink-scale'}, {'name':gettext('Standard portion'), 'slug':'standard-portion'}, {'name':gettext('Cereal'), 'slug':'cereal'}, {'name':gettext('Milk on cereal'), 'slug':'milk-on-cereal'}, {'name':gettext('Milk in a hot drink'), 'slug':'milk-in-a-hot-drink'}, {'name':gettext('Pizza'), 'slug':'pizza'}],
			cerealTypes: [{'name':gettext('Hoop'), 'slug':'hoop'}, {'name':gettext('Flake'), 'slug':'flake'}, {'name':gettext('Rice krispie'), 'slug':'rice-krispie'}],
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
});
