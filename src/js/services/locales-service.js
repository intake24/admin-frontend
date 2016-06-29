'use strict';

module.exports = function(app) {
    app.service('Locales', ['$window', '$rootScope', 'LocaleData', 'Packer', serviceFun]);
};

function serviceFun($window, $rootScope, localeData, packer) {

	var locales = [];

	var currentLocale = $window.intake24_locale;

	$rootScope.$on("intake24.admin.LoggedIn", function(event) {
		reloadLocales();
	});

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

	function reloadLocales() {
		localeData.getAllLocales( function(data) {
			locales = $.map(data, unpackLocale);
		},
		function(response) {
			console.error("Failed to load locale information");
		});
	}

	return {
		list : function() {
			return locales;
		},

		current: function() {
			return currentLocale;
		}
	};

}
