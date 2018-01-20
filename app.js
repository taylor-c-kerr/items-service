var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var keys = require('./config/keys');
var cookieSession = require('cookie-session');
var passport = require('passport');
var cors = require('cors');

var apiRoutes = require('./routes/index');
var authRoutes = require('./routes/auth-routes');
var profRoutes = require('./routes/profile');

var passportSetup = require('./config/passport-setup');

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, { useMongoClient: true });
// set up promises for mongoose
mongoose.Promise = global.Promise;

// initiating the app
var app = express();
// allow cors to be done in http requests
app.use(cors());

app.use(cookieSession({
	// 1 day = 24 hours * 60 min/hr * 60 sec/min * 1000 ms/sec
	maxAge: 24 * 60 * 60 * 1000,
	keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', apiRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json({
  	message: err.message,
  	error:req.app.get('env') === 'development' ? err : {}
  })
});

module.exports = app;