// Routes

exports.dashboardDefault = function(req, res){
	req.setLocale('en');
	res.render('index', { title : req.gettext('Dashboard'), intake24_locale: 'en_GB' });
};

exports.dashboard = function(req, res){
	req.setLocale(req.params.ui_lang);
	res.render('index', { title : req.gettext('Dashboard'), intake24_locale: req.params.intake_locale });
};
