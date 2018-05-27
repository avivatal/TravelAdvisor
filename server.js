//this is only an example, handling everything is yours responsibilty !
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
var util = require('util');
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DButils');
var Datetime = require('node-datetime');

////////////////////////////////////users

app.get('/Users', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Users")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});


//login user
app.post('/Users/login', function(req,res){
    ///token
    DButilsAzure.execQuery("SELECT * FROM Users WHERE Username='"+req.body.Username+"' AND Password='"+req.body.Password+"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})

app.post('/Users',function(req,res){
    DButilsAzure.execQuery("INSERT INTO Users (Username,Password,Firstname,Lastname,City,Country,Email,Securityanswer) VALUES ('"+req.body.Username+"', '"+req.body.Password+"','"+req.body.Firstname+"', '"+req.body.Lastname+"', '"+req.body.City+"', '"+req.body.Country+"','"+req.body.Email+"', '"+req.body.SecurityAnswer+"')")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});

app.post('/Users/recoverPassword', function(req,res){

    var Username = req.body.Username;
    var ans = req.body.Securityanswer;
    console.log(Username);
    console.log(ans);
    DButilsAzure.execQuery("SELECT Password, Securityanswer FROM Users WHERE Username='"+Username+"'")
    .then(function(result){
        if(verifySecurityAnswer(result,ans) === true){
            res.send(result[0].Password)
        }
        else{
            res.sendStatus(400)
        }
    }).catch(function(err){
        console.log(err)
    })
});

function verifySecurityAnswer(result,ans) {
    if(result[0].SecurityAnswer === ans)
    {
        return true;
    }
    return false;
}


/////////////////////////sites

app.get('/Sites',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})

app.get('/Sites/:Category', function(req,res){
    console.log('test')
    console.log(req.params.Category)
    DButilsAzure.execQuery("SELECT * FROM Sites WHERE Category = '"+ req.params.Category +"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});

app.get('/SavedSites/:Username', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM SavedSites WHERE Username = '"+ req.params.Username +"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})

app.get('/PopularSites', function(req,res){
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

app.post('/SavedSites/',function(req,res){
    /// Token
  /*  DButilsAzure.execQuery("SELECT * FROM SavedSites WHERE Username='"+req.body.Username+"'")
    .then(function(result){
        if(result.length >= 2){
            var sitename;
            if(result[0].Date < result[1].Date){
                sitename = result[0].Siteid;
            }
            else{
                sitename = result[1].Siteid;
            }
            DButilsAzure.execQuery("DELETE FROM SavedSites WHERE Username='"+req.body.Username+"' AND Siteid='"+sitename+"'")
            .then(function(result){
                res.send(result)
            }).catch(function(err){
                console.log(err)
            })
        }*/
        var Date1 = Datetime.create().format("Y-m-d H:M:S");
        console.log(Date1);
        DButilsAzure.execQuery("INSERT INTO SavedSites (Username,Siteid,Date) VALUES ('"+req.body.Username+"', '"+req.body.Siteid+"','"+ Date1+"')")
        .then(function(result){
            res.send(result)
        }).catch(function(err){
            console.log(err)
        })
      //  res.send
   /* }).catch(function(err){
        console.log(err)
    })
  */
})

app.delete('/SavedSites', function(req,res){
    DButilsAzure.execQuery("DELETE FROM SavedSites WHERE Username = '"+ req.body.Username +"' AND Siteid='"+req.body.Siteid+"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})

app.post('/RateSite',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites WHERE Siteid = '"+ req.body.Siteid +"'")
    .then(function(result){
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
    }).catch(function(err){
        console.log(err)
    })
})

app.post('/ReviewSite',function(req,res){
    var Date1 = Datetime.create().format("Y-m-d H:M:S");
    DButilsAzure.execQuery("INSERT INTO SiteComments (Siteid,Comment,Date) VALUES ('"+parseInt(req.body.Siteid)+"', '"+req.body.Comment+"','"+Date1+"')")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});

//////////////////categories

app.get('/Categories',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Categories")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});

app.get('/Categories/:Username',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM UserCategories WHERE Username='"+req.body.Username+"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});

var port = 8080;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//------------------- /