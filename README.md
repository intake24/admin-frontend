## Intake24 Admin Panel
    A node/angular web application that interfaces with the Intake24 backend to allow users to manage food databases for multiple languages.

## i18n
	i18n is implemented using 'i18n-abide' by Mozilla ('https://github.com/mozilla/i18n-abide')

	# Scrape strings into a POT file
	/Users/edjenkins/MAMP/intake-node/node_modules/i18n-abide/node_modules/.bin/jsxgettext --keyword=_ -L jade --output-dir=/Users/edjenkins/MAMP/intake-node/locale/templates/LC_MESSAGES --from-code=utf-8 --output=messages.pot `find /Users/edjenkins/MAMP/intake-node -name '*.jade' | grep -v node_modules | grep -v .git`

	# Create PO files
	msginit --input=locale/templates/LC_MESSAGES/messages.pot --output-file=locale/de/LC_MESSAGES/messages.po -l de

	# Compile JSON files
	./node_modules/i18n-abide/bin/compile-json locale i18n