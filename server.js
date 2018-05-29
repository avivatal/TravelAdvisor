//this is only an example, handling everything is yours responsibilty !
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
var util = require('util');
var cors = require('cors');
var morgan = require('morgan');
app.use(morgan('dev'))
var jsonWebToken = require('jsonwebtoken');
app.use(cors());
var DButilsAzure = require('./DButils');
var Datetime = require('node-datetime');
var authen = require('./authen')
var authenActions = require('./authenActions')
var users = require('./users')

////////////////////////////////////users////////////////////////////////

app.use('/users', users)
app.use('/authen', authen)
app.use('/authen/Actions', authenActions)


var port = 8080;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//------------------- /