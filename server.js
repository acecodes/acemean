process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express');

var port = 3000;

var app = express();
app.listen(port);
module.exports = app;

console.log('Server running at localhost: ' + port);