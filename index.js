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



var port = 3005;




var app = express();

var mysql = require('mysql');
/*


*/


const { Pool, Client } = require("pg");
const pool = new Pool({
  user:"postgres",
  host:"localhost",
  database:"Tentit_uusi",
  password: "AK6090oeSQL",
  port: 5432,
});
/*
pool.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  pool.end();
});
*/


app.use(cors(corsOptions));





// uusi jwt-osa


app.use(express.json())

const path = require('path')

var options = {
  key: fs.readFileSync('./server-key.pem', 'utf8'),
  cert: fs.readFileSync('./server-cert.pem', 'utf8'),
};


app.use(express.static(path.join(__dirname, 'build')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

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
  
    console.log("Register sai: ", req.body.username)
    const nimi = req.body.username;
    
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        
      console.log(hash)        
      var salattuSalasana = hash
      console.log(salattuSalasana);
      pool.query("INSERT INTO käyttäjä (käyttäjänimi, salasana) VALUES ($1, $2)", [nimi, salattuSalasana], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    })  
      
    
})      
      


app.post('/login', async (req, res, ) => {
  console.log("Login sai: " , req.body)
  let logindata = await pool.query("SELECT salasana FROM käyttäjä WHERE käyttäjänimi=$1", [req.body.username])
  let cr_password = Object.values(logindata.rows[0])
  console.log(req.body.password)

  console.log("saadaan:   " +cr_password)
  console.log(req.body.password.toString())
  let pass = req.body.password.toString()
  console.log(pass)
  let hashhh = cr_password.toString()
  console.log(hashhh)
  
  bcrypt.compare(pass, hashhh, function(error, result) {
    if (error) {
      throw err
    } 
    if (result) {
      console.log("se on totta! ")
      let token = jwt.sign(req.body.username, "kissa");
      res.json(token)
      console.log("login, token "+token)
    } else {
      console.log("Salasan on värin")
    }

  })
  
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

  
  /*
  app.listen(port, () => {
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


*/
var server = https.createServer(options, app).listen(443, function(){
  console.log("Express server listening on port " + 443);
  });
  /*
var server = https.createServer(options, app, function (req, res) {
  fs.readFile('db.json', {encoding: "utf8"}, function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.write(data);
    console.log(data)
    return res.end();
    });
  }).listen(443, function(){
  console.log("Express server listening on port " + 443);
  });

app.get('/', function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
});
*/