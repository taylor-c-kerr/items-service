const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cors = require('cors');

const apiRoutes = require('./routes/index');


// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, { useMongoClient: true });
// set up promises for mongoose
mongoose.Promise = global.Promise;

// initiating the app
const app = express();
// allow cors to be done in http requests
app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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