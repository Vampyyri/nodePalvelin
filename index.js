'use strict';

const axios = require('axios') 

var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
const jwt = require('jsonwebtoken');
const { application, response } = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
}



//var port = 443;
/*
var options = {
    key: fs.readFileSync('./server-key.pem', 'utf8'),
    cert: fs.readFileSync('./server-cert.pem', 'utf8'),
};
*/
var app = express();
app.use(cors(corsOptions));
var tietoja = fs.readFileSync('db.json');
var tiedot = JSON.parse(tietoja);


// uusi jwt-osa


app.use(express.json())


const checkToken = (request, response, next) => {
  //console.log("Näin sitä lisäilllään ykköstoiminto palvelimeen")
  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log("aH: " +authHeader)

  if (token == null) return response.sendStatus(401)
  console.log("Token: " +token)

  jwt.verify(token, "kissa", (err, user) => {
    console.log(err)
    if (err) return response.sendStatus(403)
    request.user = user
    console.log(user)
    next()
  })
} 

app.post('/register', (req, res, next) => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
   
  readline.question('Anna käyttäjänimi: ', kayttajanimi => {
    console.log(`Hey there ${kayttajanimi}!`);
    var nimi = kayttajanimi;
    
    readline.question('Anna salasana: ', salasana => {
      var password = salasana;
      bcrypt.hash(password, saltRounds, function(err, hash) {
        
        console.log(hash)        
        var salattuSalasana = hash
        console.log(salattuSalasana);
        
                  
          
          axios.get('http://localhost:3003/kayttajat')
            .then(function (response) {
                  console.log("noudettu data", response.data);
                  //var users = JSON.stringify(response.data)
                  //var users2 = JSON.parse(response.data)
                  console.log("Users: " +users);
                  users.push({"nimi":nimi, "salasana": salattuSalasana})
              })
              .catch(function (error) {
              console.log(error);
              })
              .then(function () {
            }); 
        
          axios.post('http://localhost:3003/kayttajat', {"nimi":nimi, "salasana": salattuSalasana})
              .then(function(response) {
                console.log("noudettu data", response.data);
                  console.log("kayttäjä lisätty ok");
                  
              })
              .catch(function (error) {
                  console.log(error);
              })
              .then(function () {
                 
  
                  // always executed
              });
        
        
    
      });  
      //console.log(`talennettu ${salattuSalasana}!`);
    })  
      readline.close();
    
    
  });

  

  //console.log("Nyt tallennetaan uusi käyttäjä")
  //console.log("Salasana salatussa muodossa on "+salattuSalasana)
})

app.post('/login', (req, res, next) => {

  /*
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
   
  readline.question('Mikä on käyttäjänimesi?  ', login => {
    console.log(`Hey there ${login}!`);
    readline.question('Mikä on  salasanasi? ', salasana => {
      console.log(`talennettu ${salasana}!`);
      
    });
    */
    console.log("Login sai: " , req.body)
    let token = jwt.sign(req.body.lo, "kissa");
    res.json(token)
    console.log("login, token "+token)
    //readline.close();  
  
  

  
})
app.use(checkToken)

// jwt-osa loppui

app.get('/', function (req, res, next) {
  if (req.user) {
    fs.readFile('./db.json', "utf8", function(err, data) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(data);
      console.log(data)
      res.end();
      });
    } else {
      res.write({message:"Ei oikeuksia"})
    }
  })

  

  app.listen(port, () => {
    console.log("Express server listening on port " + port)
  })

  const path = require('path')

  app.use(express.static(path.join(__dirname, 'build')));


  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

/*
  
*/
/*
var s_server = https.createServer(options, app).listen(port, '', null, function()  {

  var host = this.address().address;
  var port = this.address().port;
  console.log('listening at http://%s:%s', host, port);
  console.log("Express server listening on port " + port)
  
})
  
*/



/*
app.get('/', function (req, res) {

  
  res.contentType('application/json');
  res.send(util.inspect(req.socket.getPeerCertificate(true), {colors: true}));
  console.log(util.inspect(req.socket.getPeerCertificate(true)))
});

 */ 




/*

app.get('/', function (req, res) {
  res.write(tiedot);
  res.end();
});
app.listen(port, () => {
  console.log("Express server listening on port " + port)
})



var server = https.createServer(options, app, function (req, res) {
  fs.readFile('db.json', {encoding: "utf8"}, function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.write(data);
    console.log(data)
    return res.end();
    });
  }).listen(port, function(){
  console.log("Express server listening on port " + port);
  });

app.get('/', function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
});
*/
