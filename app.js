/*
 * Module dependencies
 */
var express = require('express')
    ,routes = require('./routes')
    ,stylus = require('stylus')
    ,nib = require('nib')
    ,i18n = require('i18n-abide')
    ,gettext = require('gettext')
    ,request = require('request')
    ,cors = require('express-cors')

var app = express()

app.use(i18n.abide({
  supported_languages: ['ar_AE', 'en_GB'],
  translation_directory: 'i18n',
  template_engine: 'jade',
  template_file_ext: 'jade',
  locale_on_url: true
}));

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(cors({
    allowedOrigins: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}))
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

app.get('/', routes.dashboard);

app.listen(3002)