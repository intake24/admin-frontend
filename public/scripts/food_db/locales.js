angular.module('intake24.admin.food_db').factory('Locales', ['$rootScope', 'LocaleData', 'Packer', function($rootScope, localeData, packer) {

	var locales = [];

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

	localeData.getAllLocales( function(locales) {
		locales = $.map(locales, unpackLocale);
	},
	function(response) {
	// ???
	})

	return {
		list : function() {
			return locales;
		}
	};

}]);
