var http = require('http');

var app = require('./app/app');
var config = require('./config/app');

http.createServer(app).listen(config.port);