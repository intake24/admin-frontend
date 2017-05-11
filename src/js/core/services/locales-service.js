'use strict';

var _ = require('underscore');

module.exports = function (app) {
    app.service('LocalesService', ['$window', '$rootScope', '$http', '$q', 'PackerService', 'UserStateService',
        serviceFun]);
};

function serviceFun($window, $rootScope, $http, $q, PackerService, UserStateService) {

    var locales = null;

    var localesDeferred = $q.defer();

    var currentLocale = $window.intake24_locale;

    $rootScope.$on("intake24.admin.LoggedIn", function (event) {
        reloadLocales();
    });

    reloadLocales();

    function unpackLocale(packed) {
        return {
            id: packed.id,
            englishName: packed.englishName,
            localName: packed.localName,
            respondentLanguage: packed.respondentLanguage,
            adminLanguage: packed.adminLanguage,
            flagCode: packed.flagCode,
            prototypeLocale: PackerService.unpackOption(packed.prototypeLocale),
            textDirection: packed.textDirection
        }
    }

    function reloadLocales() {
        locales = null;
        if (UserStateService.getUserInfo().canAccessLocalesList()) {
            $http.get(api_base_url + 'admin/locales').then(function (data) {
                locales = _.map(data, unpackLocale);
                localesDeferred.resolve(locales.slice());
            }, function (response) {
                console.error("Failed to load locale information");
            });
        } else {
            locales = [];
            localesDeferred.resolve(locales.slice());
        }
    }

    return {
        list: function () {
            if (locales) {
                return $q.resolve(locales.slice());
            } else {
                return localesDeferred.promise;
            }
        },

        getLocale: function (localeId) {
            return this.list().then(function (locales) {
                return locales.filter(function (locale) {
                    return locale.id == localeId;
                })[0];
            });
        },

        current: function () {
            return currentLocale;
        },

        currentInfo: function () {
            return _.find(locales, function (l) {
                return l.id == currentLocale;
            })
        }
    };

}
