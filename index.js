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
const lodash = require("lodash"); 




var port = 443;




var app = express();
//app.cors();
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

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));





// uusi jwt-osa


app.use(express.json())



const path = require('path')

var options = {
  key: fs.readFileSync('./server-key.pem', 'utf8'),
  cert: fs.readFileSync('./server-cert.pem', 'utf8'),
};


//app.use(express.static(path.join(__dirname, 'build')));




const checkToken = (request, response, next) => {
  //console.log("Näin sitä lisäilllään ykköstoiminto palvelimeen")
  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log("authHeader: " +authHeader)

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



app.post('/register', async (req, res, next) => {
  try {
    console.log("Register sai: ", req.body.username)
    const nimi = req.body.username;
    const password = req.body.password;
    console.log(password)
    let checkname = pool.query("SELECT salasana FROM käyttäjä WHERE käyttäjänimi=$1", [req.body.username])
    .then(response => {
      console.log(response)
      let salasana = Object.values(response.rows[0]).toString()
      console.log(salasana)
      res.json("Käyttäjänimi jo on olemassa")
    })
    
    .catch(error => 
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
          logger.error("bcrypt.hash "+err);
          return next(err);
        } 
        if (hash) {
          console.log(hash)        
          var salattuSalasana = hash
          console.log(salattuSalasana)
          pool.query("INSERT INTO käyttäjä (käyttäjänimi, salasana) VALUES ($1, $2)", [nimi, salattuSalasana], function (err, result) {
            if (err) throw err;
            if (result) {
              console.log("käyttäjä on lisätty")
            }
          })
        }
      })  
      
    )
    
  }  catch (error) {
    res.json({error:"jokin meni pieleen rekisteroimisessa:"+error})
  }  
  
}); 
      


app.post('/login', async (req, res, ) => {
 
  try {
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
      var token = jwt.sign(req.body.username, "kissa");
      res.json(token)
      console.log("login, token "+token)
      //return token;
    } else {
      res.json("Kirjäutuminen on epäonnistunut")
      console.log("Salasan on värin")
    }

  })
  } catch (error) {
    res.json({error:"jokin meni pieleen kirjautumisessa:"+error})
  }  
})

//app.use(checkToken)

//tunnit tietokannasta React-sovelluksiin

app.get('/lessons', checkToken, async (request, response) => {
  try {
    var lessons = await pool.query('SELECT * FROM tentti')
    .then(function (response) {
      //console.log(response)
      var tentit = response.rows
     // console.log("Tentit: ", tentit)
      return tentit
    })
    .catch(error => console.error(error))

    var questions = await pool.query('SELECT * FROM kysymys')
    .then(function (response) {
      //console.log(response)
      var kysymykset = response.rows
      //console.log("Kysymykset: ", kysymykset)
      return kysymykset
    })
    .catch(error => console.error(error))

   var answers = await pool.query('SELECT * FROM vastaus')
    .then(function (response) {
      //console.log(response)
      var vastaukset = response.rows
      //console.log("Vastaukset: ", vastaukset)
      return vastaukset
    })
    .catch(error => console.error(error))


    var kysymykset = []
    var vastaukset = []
    var new_kysymykset = []
    var new_tentit = []
    var uudet_tentit = 0

    lessons.forEach((element) => {
      
      let currentid = Object.values(element.id)

      function kys(a, currentid, key, id, kysymys_teksti) {
        console.log("tenttiid: ", Object.values(key))
        console.log("currentid: ", currentid)
        if (Object.values(key).toString() == currentid.toString()) {
          console.log("tällä ollaan!")
          //console.log(Object.values(key).toString())
          //kysymykset.push(kysymys_teksti)
          //console.log("Kysymykset: ", kysymykset)
          
        }
      }
            
      questions.forEach((item) => {
        if (Object.values(item.tenttiid).toString() == currentid.toString()){
           //kys(item, currentid, item.tenttiid, item.id, item.kysymys_teksti)
        let kys_id = item.id
        answers.forEach((i) => {
          //console.log("kys_id: ", kys_id)
          //console.log("i.kysymysid: ", i.kysymysid)
          if (Object.values(i.kysymysid).toString() == kys_id.toString()) {
            //console.log("hyväksytty_kys_id: ", kys_id)
            //console.log("hyväksytty_i.kysymysid: ", i.kysymysid)
            vastaukset.push(i.vastaus_teksti)
            //console.log("Vastaukset: ", vastaukset)
          }
        })
        
        new_kysymykset.push({id: item.id, tenttiid: item.tenttiid, kysymys_teksti: item.kysymys_teksti, vastaukset: vastaukset})
        vastaukset = []
        }
       
        //console.log("new_kysymykset: ", new_kysymykset)
        
      }) 
      
      //console.log("new_kysymykset: ", new_kysymykset)
      //new_tentit.push({id: element.id, otsikko: element.nimi, kysymykset: [{teksti: new_kysymykset[0].kysymys_teksti, vastaukset:new_kysymykset[0].vastaukset}]})  
    new_tentit.push({id: element.id, otsikko: element.nimi, kysymykset: new_kysymykset})        
      
    
      
      new_kysymykset = []
      //console.log("uudet: ", new_tentit)
      //var newnewtentit = []
      //newnewtentit.push(new_tentit)
      //console.log("uusi: ", new_tentit.kysymykset[0].vastaukset)
      
      
      //response.send(uudet_tentit)
      
    })
    console.log("Get useEffectista tuli")
    uudet_tentit = {tentit: new_tentit}
    console.log("uudet nyt: ", uudet_tentit)
    response.send(uudet_tentit)
  }  catch (error) {
    response.json({error:"jokin meni pieleen kirjautumisessa:"+error})
  }    
  
})
// loppu lohkon Tunnit tietokannasta React-sovelluksiin


app.put('/valinta', async (req, res,) => {
  console.log("ollan valinnassa")
  
  await pool.query("UPDATE käyttäjän_vastaus SET valinta = true WHERE vastaus_teksti=$1", [req.body.vastaus])
    .then(function (response) {
      console.log("vastauksen bolean on päivitetty");

    })
    .catch(function (error) {
        console.log(error);
    });
})




app.post('/lisatentti', async (req, res,) =>{
  console.log("yritään lisätä tentin")
  console.log(req.body.otsikko)
  /*let rivien_määrä = await pool.query("SELECT COUNT (nimi) FROM tentti")
  .then(function (response) {
    console.log(Object.values(response.rows[0]))
    let rivin_numero = Number(Object.values(response.rows[0]))
    let uuden_rivin_numero = (rivin_numero + 1)
    let uusi_tentti = "Tentti " + uuden_rivin_numero
    console.log(uusi_tentti)   */
    await pool.query("INSERT INTO tentti (id, nimi) VALUES ($1, $2)", [req.body.id, req.body.otsikko] )
      .then(function (response) {
        
        console.log("tentti lisätty");
        res.json("lisätty")
      })
      .catch(function (error) {
          console.log(error);

      });

  
 
})

app.post('/lisakysymys', async (req, res,) =>{
  console.log("yritään lisätä kysymyksen")
  await pool.query("INSERT INTO kysymys (tenttiid, kysymys_teksti) VALUES ($1, $2)", [req.body.tenttiid, "Mitä vielä kysyä?"] )
  .then(function (response) {
   
        console.log("kysymysi lisätty");

  })
  .catch(function (error) {
      console.log(error);

  });
 
})

app.post('/lisavastaus', async (req, res,) =>{
  console.log("yritään lisätä vastauksen")
  await pool.query("INSERT INTO vastaus (tenttiid, kysymysid, vastaus_teksti) VALUES ($1, $2, $3)", [req.body.tenttiid, req.body.kysymysid, req.body.uusivastaus] )
  .then(function (response) {
   
        console.log("vastaus lisätty");

  })
  .catch(function (error) {
      console.log(error);

  });
 
})

app.delete('/poistatentti', async (req, res,) =>{
  console.log("yritään poista tentin")
  console.log(req.query.id)
  //let tiedot = req.params.current_id
  //console.log(tiedot)
  console.log(req.body.data)
  await pool.query("DELETE FROM tentti WHERE id=$1", [req.query.id])
  .then(function (res) {
    console.log("tuntti poistettu")
  })
  .catch(function (err) {
      console.log(err);

  });
 
})

app.delete('/poistavastaus', async (req, res,) =>{
  console.log("yritään poista vastauksen")
  await pool.query("DELETE FROM vastaus WHERE id=$1", [req.body.vastaus])
  .then(function (response) {
    console.log("vastaus poistettu")
  })
  .catch(function (error) {
      console.log(error);

  });
 
})
/*
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
*/






// jwt-osa loppui
/*
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

  */
 /*
  
app.get('/', function (req, res) {

  
  res.contentType('application/json');
  res.send(util.inspect(req.socket.getPeerCertificate(true), {colors: true}));
  console.log(util.inspect(req.socket.getPeerCertificate(true)))
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