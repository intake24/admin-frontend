// Routes

exports.dashboard = function(req, res){
	res.render('index', { title : req.gettext('Dashboard') })
};