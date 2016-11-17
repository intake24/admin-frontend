'use strict';

module.exports = function(app) {
    require('./img-loader-directive')(app);
    require('./tag-input-directive')(app);
    require('./search-input-directive')(app);
    require('./file-button-directive')(app);
    require('./file-drop-zone-directive')(app);
    require('./image-select-drawer-directive')(app);
    require('./as-served-set-directive')(app);
    require('./contenteditable')(app);
    require('./editable-directive')(app);
    require("./on-scrolled-to-bottom")(app);
};