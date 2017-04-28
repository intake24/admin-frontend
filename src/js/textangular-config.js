/**
 * Created by Tim Osadchiy on 23/02/2017.
 */

"use strict";

module.exports = function (app) {
    app.config(['$provide', function ($provide) {
        // this demonstrates how to register a new tool and add it to the default toolbar
        $provide.decorator('taOptions', ['$delegate', function (taOptions) {
            // $delegate is the taOptions we are decorating
            // here we override the default toolbars and classes specified in taOptions.
            taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
            taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
            taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'h4', 'p', 'insertLink', 'insertImage'],
                ['bold', 'italics', 'underline', 'ul', 'ol'],
                ['redo', 'undo', 'clear'],
                ['wordcount', 'charcount']
            ];
            taOptions.classes = {
                focussed: 'focussed',
                toolbar: 'btn-toolbar form-group',
                toolbarGroup: 'btn-group',
                toolbarButton: 'btn btn-default',
                toolbarButtonActive: 'active',
                disabled: 'disabled',
                textEditor: 'form-control ta-editor-small',
                htmlEditor: 'form-control'
            };
            return taOptions; // whatever you return will be the taOptions
        }]);

    }]);
};
