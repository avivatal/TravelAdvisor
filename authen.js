var express = require('express');
var router = express.Router();
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var jsonWebToken = require('jsonwebtoken');
var superSecret = "AdMatayi"


router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jsonWebToken.verify(token, superSecret, function (err, decoded){
            if(err) {
                console.log('error')
                return res.json( {success: false, message: 'failed to verify token'});
                
            } else {
                req.decoded = decoded;
                console.log('test')
                next();
            }
        })
    }
})

module.exports = router
