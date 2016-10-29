'use strict';

module.exports = function(app) {
    require('./img-loader-directive')(app);
    require('./tag-input-directive')(app);
    require('./search-input-directive')(app);
    require('./file-button-directive')(app);
    require('./file-drop-zone-directive')(app);
    require('./image-select-drawer-directive')(app);
};