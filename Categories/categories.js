app.get('/Categories',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Categories")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
});