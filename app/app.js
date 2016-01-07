var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var errors = require('./router/errors');
var index = require('./router/index');
var api = require('./router/api');

var app = express();

//render templates
app.set('view engine', 'jade');
app.set('views', __dirname +  '/../client/views');

//POST request and cookies
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//API
app.use('/api', api);

//Main page
app.use('/', index);


//Errors
app.use(errors.e404);
app.use(errors.render);

module.exports = app;