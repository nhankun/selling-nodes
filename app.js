var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const i18n = require('i18n');

// env config
const result = require('dotenv').config();
if (result.error) {
  throw result.error
}
// console.log(result.parsed)

const route = require('./routes')
const db = require('./config/db');
// Connect to db
db.connect();

var app = express();

//Use Node.js body parsing middleware 
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 1000000 }));
// app.use(bodyParser.raw({ type: 'application/json' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('express-ejs-extend'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// lang
i18n.configure({
  locales:['vi','en'],
  directory: __dirname + '/locales',
  defaultLocale: 'vi',
  // register :global,
  cookie: 'lang',
  objectNotation: true
});
app.use(i18n.init);
const lang = function(req, res,next){
  res.locals.language = res.getLocale(req);
  res.locals.arr_lang = res.getLocales();
  next();
}
app.use(lang);

// Route init
route(app);

// set locals variables
// function setLocalsVariables(req, res){
//   return res.locals.admin_setting = '/admin/settings/';
// }
// app.use(setLocalsVariables);
// global.debug = console.log.bind(console);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
