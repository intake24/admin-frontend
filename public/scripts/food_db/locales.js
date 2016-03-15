angular.module('intake24.admin.food_db').factory('Locales', ['$window', 'LocaleData', 'Packer', function($window, localeData, packer) {

	var locales = [];

	var currentLocale = $window.intake24_locale;

	function unpackLocale(packed) {
		return {
			id : packed.id,
			englishName : packed.englishName,
			localName: packed.localName,
			respondentLanguage: packed.respondentLanguage,
			adminLanguage: packed.adminLanguage,
			flagCode: packed.flagCode,
			prototypeLocale: packer.unpackOption(packed.prototypeLocale)
		}
	}

	localeData.getAllLocales( function(data) {
		locales = $.map(data, unpackLocale);
	},
	function(response) {
	// ???
	});

	return {
		list : function() {
			return locales;
		},

		current: function() {
			return currentLocale;
		}
	};

}]);
