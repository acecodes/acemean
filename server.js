var express = require('express');
var app = express();

app.use('/', function(req, res) {
    res.send('Hello World');
});

app.listen(6000);
console.log('Server running at http://localhost:6000');

module.exports = app;