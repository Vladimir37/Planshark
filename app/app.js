var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var status = require('./basis/status');
var webpack = require('./basis/webpack');
var errors = require('./router/errors');
var index = require('./router/index');
var api = require('./router/api');

//start packaging
webpack();

var app = express();

//render templates
app.set('view engine', 'jade');
app.set('views', __dirname +  '/../client/view');

//POST request and cookies
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//favicon
app.use(favicon(__dirname + '/../client/source/img/favicon/favicon.ico'));

//Determination user status
app.use(status.soft);

//public source
app.use('/src', express.static(__dirname + '/../client/source'));

//API
app.use('/api', api);

//Main page
app.use('/', index);


//Errors
app.use(errors.e404);
app.use(errors.render);

module.exports = app;