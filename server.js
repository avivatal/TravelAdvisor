//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var util = require('util')
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DButils');

app.get('/Users', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Users")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})
//////////  WRITE ROUTES AND db REQURESTS HERE, LOOK AT SLIDE 20 
app.post('/Usersa',function(req,res){
  /*  var Username = req.bodyParser.Username;
    var Firstname = req.bodyParser.Firstname;
    var Lastname = req.bodyParser.Lastname;
    var City = req.bodyParser.City;
    var Country = req.bodyParser.Country;
    var Password = req.bodyParser.Password;
    var Email = req.bodyParser.Email;
    var SecurityAnswer =  req.bodyParser.SecurityAnswer;*/
    DButilsAzure.execQuery("INSERT INTO Users (Username,Password,Firstname,Lastname,City,Country,Email,Securityanswer) VALUES ("+'req.bodyParser.Username'+", "+'req.bodyParser.Firstname'+", "+'req.bodyParser.Lastname'+", "+'req.bodyParser.City'+", "+'req.bodyParser.Country'+", "+'req.bodyParser.Email'+", "+'req.bodyParser.SecurityAnswer'+")")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })

    /*var reqest = new Request("INSERT INTO Users ( Username,Password,Firstname,Lastname,City,Country,Email,Securityanswer) VALUES ("+'req.bodyParser.Username'+", "+'req.bodyParser.Firstname'+", "+'req.bodyParser.Lastname'+", "+'req.bodyParser.City'+", "+'req.bodyParser.Country'+", "+'req.bodyParser.Email'+", "+'req.bodyParser.SecurityAnswer'+")", function(err,rowCount){
        if( err){
            console.log(err)
        }
    });
  /*  reqest.addParameter('Username',TYPES.NVarChar,Username);
    reqest.addParameter('Firstname',TYPES.NVarChar,Firstname);
    reqest.addParameter('Lastname',TYPES.NVarChar,Lastname);
    reqest.addParameter('City',TYPES.NVarChar,City);
    reqest.addParameter('Counrty',TYPES.NVarChar,Country);
    reqest.addParameter('Password',TYPES.NVarChar,Password);
    reqest.addParameter('Email',TYPES.NVarChar,Email);
    reqest.addParameter('Securityanswer',TYPES.NVarChar,SecurityAnswer);*/

   /* DButilsAzure.execQuery(reqest)
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })*/
})

var port = 8080;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------


