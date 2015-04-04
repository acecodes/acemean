process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express'),
    mongoose = require('./config/mongoose'),
    passport = require('./config/passport');

var port = 3000;

var db = mongoose();
var app = express();
var passport = passport();

app.listen(port);
module.exports = app;

console.log('Server running at localhost: ' + port);