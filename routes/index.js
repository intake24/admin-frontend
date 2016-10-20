// Routes

exports.dashboardDefault = function(req, res){
	req.setLocale('en');
	res.render('food-explorer/index', { title : req.gettext('Dashboard'), intake24_locale: 'en_GB' });
};

exports.dashboard = function(req, res){
	req.setLocale(req.params.ui_lang);
	res.render('food-explorer/index', { title : req.gettext('Dashboard'), intake24_locale: req.params.intake_locale });
};

exports.imageGallery = function(req, res){
	req.setLocale('en');
	res.render('image-gallery/index', { title : req.gettext('Image gallery'), intake24_locale: 'en_GB' });
};
