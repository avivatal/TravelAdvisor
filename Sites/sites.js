

app.get('/Sites/',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})
app.get('Sites/:Category', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites WHERE Category = '"+ req.body.Category +"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})
app.get('Sites/:Username', function(req,res){
    DButilsAzure.execQuery("SELECT * FROM SavedSites WHERE Username = '"+ req.body.Username +"'")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})
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