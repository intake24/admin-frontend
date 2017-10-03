'use strict';

module.exports = function(app) {
    require('./img-loader-directive')(app);
    require('./tag-input-directive')(app);
    require('./search-input-directive')(app);
    require('./file-drop-zone-directive')(app);
    require('./image-select-drawer-directive')(app);
    require('./as-served-set-directive')(app);
    require('./intk-contenteditable')(app);
    require('./editable-directive')(app);
    require("./on-scrolled-to-bottom")(app);
    require("./image-gallery-main-item")(app);
    require("./guided-image-editor/guided-image-editor.directive")(app);
    require("./guided-images-explorer/guided-images-explorer.directive")(app);
};