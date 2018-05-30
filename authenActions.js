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
var router = express.Router();
var Datetime = require('node-datetime');


//get users saved sites
router.get('/SavedSites/', function(req,res){
    var token = req.decoded;
                DButilsAzure.execQuery("SELECT * FROM SavedSites WHERE Username = '"+ token.username +"'")
               .then(function(result){
                res.send(result)
            }).catch(function(err){
                console.log(err)
    });
});

//user save site
router.post('/SavedSites/',function(req,res){

    var token = req.decoded;
                    var Date1 = Datetime.create().format("Y-m-d H:M:S");
                    console.log(Date1+'DATE');
            
                    DButilsAzure.execQuery("INSERT INTO SavedSites (Username,Siteid,Date) VALUES ('"+token.username+"', '"+req.body.Siteid+"','"+ Date1+"')")
                    .then(function(result){
                        res.send(result)
                    }).catch(function(err){
                        console.log(err)
                    })
            });

//delete user saved sites
router.delete('/SavedSites', function(req,res){
    var token = req.decoded;
    DButilsAzure.execQuery("DELETE FROM SavedSites WHERE Username = '"+ token.username +"' AND Siteid='"+req.body.Siteid+"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})

//update site priority
router.post('/SavedSites/Priority',function(req,res){

    var token = req.decoded;            
                    DButilsAzure.execQuery("UPDATE SavedSites SET Priority='"+req.body.Priority+"' WHERE Username='"+token.username+"' AND Siteid='"+req.body.Siteid+"'")
                    .then(function(result){
                        res.send(result)
                    }).catch(function(err){
                        console.log(err)
                    })
            });

//get user categories
router.get('/Categories',function(req,res){
    var token = req.decoded;
    console.log(token.username)
    DButilsAzure.execQuery("SELECT * FROM Users WHERE Username='"+token.username+"'")
    .then(function(result){
        if(result.length > 0){
        DButilsAzure.execQuery("SELECT * FROM UserCategories WHERE Username='"+token.username+"'")
        .then(function(result){
            res.send(result)
        }).catch(function(err){
            console.log(err)
        })    }}).catch(function(err){
        console.log(err)
    })

});

module.exports = router
