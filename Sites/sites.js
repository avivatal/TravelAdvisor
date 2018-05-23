

//get all sites
app.get('/Sites',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})

//get sites by category
app.get('Sites/:Category', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites WHERE Category = '"+ req.bodyParser.Category +"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})

// get users saved sites
app.get('Sites/:Username', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM SavedSites WHERE Username = '"+ req.bodyParser.Username +"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})

//get 3 popular random sites
app.get('Sites/getPopulars/', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites WHERE Rating > 3")
    .then(function(result){
        var size=result.size;
        var random1=Math.floor(Math.random()*size);
        var random2=Math.floor(Math.random()*size);
        while(random1 == random2){
            random2=Math.floor(Math.random()*size);
        }
        var random3=Math.floor(Math.random()*size);
        while(random2 == random3 || random1 == random3){
            random3=Math.floor(Math.random()*size);
        }
        var ans = [result[random1],result[random2],result[random3]];
        res.send(ans)
    }).catch(function(err){
        console.log(err)
    })
})

//get site
app.get('/Sites/:Sitename',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites WHERE Sitename = '"+req.bodyParser.Sitename+"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})

//save site for user
app.post('/Sites/saveSite/:Username,Siteid',function(req,res){
    DButilsAzure.execQuery("INSERT INTO Savedsites (Username,Siteid) VALUES ("+req.bodyParser.Username+", "+req.bodyParser.Siteid+")")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})