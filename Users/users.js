app.post('/Users/addUser',function(req,res){
    var Username = req.bodyParser.Username;
    var Firstname = req.bodyParser.Firstname;
    var Lastname = req.bodyParser.Lastname;
    var City = req.bodyParser.City;
    var Country = req.bodyParser.Country;
    var Password = req.bodyParser.Password;
    var Email = req.bodyParser.Email;
    var SecurityAnswer =  req.bodyParser.SecurityAnswer;

    var req= new Request("INSERT INTO Users ( [Username],[Password],[Firstname],[Lastname],[City],[Country],[Email],[Securityanswer]) VALUES (@Username,@Firstname,@Lastname,@City,@Country,@Email,@SecurityAnswer)", function(err,rowCount){
        if( err){
            console.log(err)
        }
    });
    req.addParameter('Username',TYPES.NVarChar,Username);
    req.addParameter('Firstname',TYPES.NVarChar,Firstname);
    req.addParameter('Lastname',TYPES.NVarChar,Lastname);
    req.addParameter('City',TYPES.NVarChar,City);
    req.addParameter('Counrty',TYPES.NVarChar,Country);
    req.addParameter('Password',TYPES.NVarChar,Password);
    req.addParameter('Email',TYPES.NVarChar,Email);
    req.addParameter('Securityanswer',TYPES.NVarChar,SecurityAnswer);

})
