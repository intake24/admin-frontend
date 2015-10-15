/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , i18n = require('i18n-abide')
  , request = require('request')
  , cors = require('express-cors')

var app = express()
// var app = angular.module('app', []);
app.use(i18n.abide({
  supported_languages: ['en-US', 'de'],
  default_lang: 'en-US',
  debug_lang: 'it-CH',
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

app.get('/', function (req, res) {
  res.render('index', { title : req.gettext('Dashboard') })
})

app.listen(3000)