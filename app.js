/*
 * Module dependencies
 */
var express = require('express');
var cors = require('cors');
var helmet = require('helmet');
var i18n = require('i18n-abide');
var logger = require('morgan');
var routes = require('./routes');

var app = express();
app.use(helmet());

app.use(i18n.abide({
  supported_languages: ['ar', 'en'],
  translation_directory: 'public/i18n',
  template_engine: 'pug',
  template_file_ext: 'pug'
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(cors({
    allowedOrigins: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/', routes.dashboardDefault);
app.get('/:intake_locale/:ui_lang', routes.dashboard);
// app.get('/image-gallery', routes.imageGallery);
app.get('/password-reset', routes.passwordReset);

app.listen(3002);
