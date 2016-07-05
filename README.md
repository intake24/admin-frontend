## Intake24 Admin Panel
    A node/angular web application that interfaces with the Intake24 backend to allow users to manage food databases for multiple languages.
    
## Building front-end JS and CSS
All JavaScript is built into `public/intake24-admin.js` from `src/js/intake24-admin.js`.
All CSS is built into `public/style.css` from `src/styl/style.styl`.

To build scripts and styles for production run `grunt --config {your_config.json}`.

**Example config:**

`{`<br/>
    `"apiBaseUrl": "http://localhost:9000/",`<br/>
    `"stylusFrom": "src/styl/style.styl",`<br/>
    `"stylusWatch": "src/styl/*",`<br/>
    `"stylusTo": "public/style.css",`<br/>
    `"browserifyFrom": "src/js/intake24-admin.js",`<br/>
    `"browserifyTo": "src/js/temp/intake24-admin.browserified.js",`<br/>
    `"buildJsTo": "public/intake24-admin.js",`<br/>
    `"uglifyJs": false,`<br/>
    `"includeCssMaps": true,`<br/>
    `"includeJsMaps": true,`<br/>
    `"watchStylus": true,`<br/>
    `"watchJs": true,`<br/>
    `"watchDebounceDelay": 5000`<br/>
`}`

## i18n
	i18n is implemented using 'i18n-abide' by Mozilla ('https://github.com/mozilla/i18n-abide')

	# Scrape strings into a POT file
	/Users/edjenkins/MAMP/intake-node/node_modules/i18n-abide/node_modules/.bin/jsxgettext --keyword=_ -L jade --output-dir=/Users/edjenkins/MAMP/intake-node/locale/templates/LC_MESSAGES --from-code=utf-8 --output=messages.pot `find /Users/edjenkins/MAMP/intake-node -name '*.jade' | grep -v node_modules | grep -v .git`

	# Create PO files
	msginit --input=locale/templates/LC_MESSAGES/messages.pot --output-file=locale/ar/LC_MESSAGES/messages.po -l ar

	# Compile JSON files
	./node_modules/i18n-abide/bin/compile-json locale public/i18n