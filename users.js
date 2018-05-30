
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
var superSecret = "AdMatayi"


//login user
router.post('/login', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Users WHERE Username='"+req.body.Username+"' AND Password='"+req.body.Password+"'")
    .then(function(result){
        if(result.length > 0){//user exist with this password
            var payload = {
                username: req.body.Username
            }
            var Token = jsonWebToken.sign(payload, superSecret, {
                expiresIn: "1d"
            });

            res.json({
                success: true,
                token: Token
            })
        } else {
            res.sendStatus(400)//error
        }
    }).catch(function(err){
        console.log(err)
    })
})

//register new user
router.post('/',function(req,res){
    var username = req.body.Username;
    var pass = req.body.Password;
    var email = req.body.Email;
    var error = '';
    if(username.length < 3 || username.length > 8){
        error = 'Username must be between 3 and 8 characters ';
    }
    if(pass.length < 5 || pass.length >10){
        error += 'Password must be between 5 and 10 characters ';
    }
    if(! /^[a-zA-Z]+$/.test(username)){
        error += 'Username may contain only letters ';
    }
    if(! /^[a-zA-Z0-9]+$/.test(pass)){
        error += 'Password may contain letters and numbers '
    }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(! re.test(String(email).toLowerCase())){
        error += 'email is not in the rigth syntax '
    }
    if(error === ''){
       
    DButilsAzure.execQuery("SELECT * FROM Users WHERE Username = '"+username+"'")
    .then(function(result){
        if(result.length == 0){//username not exist
            DButilsAzure.execQuery("SELECT * FROM Users WHERE Password = '"+pass+"'")
            .then(function(result){
                if(result.length == 0){//password dosent exist{
                    DButilsAzure.execQuery("INSERT INTO Users (Username,Password,Firstname,Lastname,City,Country,Email,Securityanswer) VALUES ('"+username+"', '"+pass+"','"+req.body.Firstname+"', '"+req.body.Lastname+"', '"+req.body.City+"', '"+req.body.Country+"','"+email+"', '"+req.body.Securityanswer+"')")
                    .then(function(result){
                        res.sendStatus(200)
                    }).catch(function(err){
                        console.log(err)
                    })
                    res.sendStatus(200)
                } else {
                    res.sendStatus(400)
                }
            }).catch(function(err){
                console.log(err)
            })
        } else {
            res.sendStatus(400)
        }
    }).catch(function(err){
        console.log(err)
    })
} else {
    res.send(error)
}
});

//get all users
router.get('/', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Users")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});


//recover user password
router.post('/recoverPassword', function(req,res){
    var Username = req.body.Username;
    var ans = req.body.Securityanswer;
    DButilsAzure.execQuery("SELECT Password, Securityanswer FROM Users WHERE Username='"+Username+"'")
    .then(function(result){
        if(result.length>0){
        if(verifySecurityAnswer(result,ans) === true){
            res.send(result[0].Password)//recover password
        } else {
            res.sendStatus(400)//security answer not correct
        }} else{
            res.sendStatus(400)//username dossent exist
        }
    }).catch(function(err){
        console.log(err)
    })
});

function verifySecurityAnswer(result,ans) {
    if(result[0].Securityanswer === ans)
    {
        return true;
    }
    return false;
}

//get all sites
router.get('/Sites',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})

//get sites by category
router.get('/Sites/:Category', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Categories WHERE Category ='"+ req.params.Category +"'")
    .then(function(result){
        if(result.length > 0){
            DButilsAzure.execQuery("SELECT * FROM Sites WHERE Category = '"+ req.params.Category +"'")
            .then(function(result){
                res.send(result)
            }).catch(function(err){
                console.log(err)
            })
        } else {
            res.send(400);//category dosent exist
        }
    }).catch(function(err){
        console.log(err)
    })
});

//get random 3 popular sites
router.get('/PopularSites', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites WHERE Rating >= 3")
    .then(function(result){
        var size=result.length;
        var random1=Math.floor(Math.random()*size);
        var random2=Math.floor(Math.random()*size);
        while(random1 == random2){
            random2=Math.floor(Math.random()*size);
        }
        var random3=Math.floor(Math.random()*size);
        while(random2 == random3 || random1 == random3){
            random3=Math.floor(Math.random()*size);
        }
        console.log(random1)
        console.log(random2)
        console.log(random3)

        var ans = [result[random1],result[random2],result[random3]];
        res.send(ans)
    }).catch(function(err){
        console.log(err)
    })
})

//rate site
router.post('/RateSite',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites WHERE Siteid = '"+ req.body.Siteid +"'")
    .then(function(result){
        if(result.length >0){
        var numberOfRatings = parseInt(result[0].NumberOfRatings)+1;
        var rating =parseFloat(result[0].Rating);
        var newrate = (parseFloat(req.body.Rating) + (rating  * (numberOfRatings-1))) / (numberOfRatings);

        console.log(newrate)
        DButilsAzure.execQuery("UPDATE Sites SET Rating='"+newrate+"',NumberOfRatings='"+numberOfRatings+"' WHERE Siteid = '"+ req.body.Siteid +"'")
        .then(function(result){
            res.send(result)
        }).catch(function(err){
            console.log(err)
        })
    } else {
        res.sendStatus(400);//site id dosent exist
    }}).catch(function(err){
        console.log(err)
    })
})

router.post('/UpdateViews',function(req,res){
    
    DButilsAzure.execQuery("UPDATE Sites SET Views='"+req.body.Views+"' WHERE Siteid = '"+ req.body.Siteid +"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});

//review site
router.post('/ReviewSite',function(req,res){
    var Date1 = Datetime.create().format("Y-m-d H:M:S");
    DButilsAzure.execQuery("INSERT INTO SiteComments (Siteid,Comment,Date) VALUES ('"+parseInt(req.body.Siteid)+"', '"+req.body.Comment+"','"+Date1+"')")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});

//get all categories
router.get('/Categories',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Categories")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});

module.exports = router
