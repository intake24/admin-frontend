'use strict';

module.exports = function () {
    return {
        stylusFrom: 'src/styl/style.styl',
        stylusWatch: 'src/styl/*',
        stylusTo: 'public/style.css',

        browserifyFrom: 'src/js/intake24-admin.js',
        browserifyTo: 'src/js/temp/intake24-admin.browserified.js',

        buildJsTo: 'public/intake24-admin.js'
    };
};