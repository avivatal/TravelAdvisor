

app.get('Sites/getSites',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Sites")
    .then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
    })
})
