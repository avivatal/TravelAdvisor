//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DButils');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//complete your code here
app.get('Categories/getCategories',function(req,res){
    DButilsAzure.execQuery("SELECT * FROM Categories")
    .then(function(result){
        res.send(result)
    })
})

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------



