process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express'),
    mongoose = require('./config/mongoose');

var port = 3000;

var db = mongoose();
var app = express();
app.listen(port);
module.exports = app;

console.log('Server running at localhost: ' + port);