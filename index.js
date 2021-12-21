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
/* 
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
} */



var port = 3005;




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


app.use(cors(/* corsOptions */));





// uusi jwt-osa


app.use(express.json())

const path = require('path')

var options = {
  key: fs.readFileSync('./server-key.pem', 'utf8'),
  cert: fs.readFileSync('./server-cert.pem', 'utf8'),
};


app.use(express.static(path.join(__dirname, 'build')));



/*
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

*/

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



app.get('/lessons', async (req, res) => {
  
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


    /*
    console.log(lessons)
    console.log(questions)
    console.log(answers)
    */
    var kysymykset = []
    
    lessons.forEach((element) => {
      
      let currentid = Object.values(element.id)

      function kys(a, currentid, key, id, kysymys_teksti) {
        console.log("tenttiid: ", Object.values(key))
        console.log("currentid: ", currentid)
        if (Object.values(key).toString() == currentid.toString()) {
          console.log("tällä ollaan!")
          kysymykset.push({id, kysymys_teksti})
          console.log("kysymykset   ", kysymykset)
        }
      }
            
      questions.forEach((element) => {
        kys(element, currentid, element.tenttiid, element.id, element.kysymys_teksti)
        var kysymyksiä = {"kysymykset": [{kysymykset}]}
        var new_lessons = Object.assign(lessons, kysymykset)  
        console.log("New: ", new_lessons)
      }) 
      
        
      
    })
      

})


/*
app.put('/valinta', async (req, res,) => {
  console.log("ollan valinnassa")
  
  await pool.query("UPDATE käyttäjän_vastaus SET totuus = true WHERE id=$1", [req.body.vastaus])
    .then(function (response) {
      console.log("vastauksen bolean on päivitetty");

    })
    .catch(function (error) {
        console.log(error);
    });
})
*/

app.post('/valinta', async (req, res,) => {
  console.log("ollan valinnassa")
  
  await pool.query("INSERT INTO käyttäjän_vastaus (käyttäjäid, vastausid, valinta) VALUES ($1, $2, true)", [req.body.vastaus])
    .then(function (response) {
      console.log("vastauksen bolean on päivitetty");

    })
    .catch(function (error) {
        console.log(error);
    });
})

app.post('/lisatentti', async (req, res,) =>{
  console.log("yritään lisätä tentin")
  let rivien_määrä = await pool.query("SELECT COUNT (nimi) FROM tentti")
  .then(function (response) {
    console.log(Object.values(response.rows[0]))
    let rivin_numero = Number(Object.values(response.rows[0]))
    let uuden_rivin_numero = (rivin_numero + 1)
    let uusi_tentti = "Tentti " + uuden_rivin_numero
    console.log(uusi_tentti)
    pool.query("INSERT INTO tentti (nimi) VALUES ($1)", [uusi_tentti] )
      .then(function (response) {
        console.log("tentti lisätty");

      })
      .catch(function (error) {
          console.log(error);

      });

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
  await pool.query("INSERT INTO vastaus (tenttiid, kysymysid, vastaus_teksti) VALUES ($1, $2, $3)", [req.body.tenttiid, req.body.vastausid, req.body.uusivastaus] )
  .then(function (response) {
   
        console.log("vastaus lisätty");

  })
  .catch(function (error) {
      console.log(error);

  });
 
})

app.delete('/poistatentti', async (req, res,) =>{
  console.log("yritään poista tentin")
  await pool.query("DELETE FROM tentti WHERE id=$1", [req.body.tentti])
  .then(function (response) {
    console.log("tuntti poistettu")
  })
  .catch(function (error) {
      console.log(error);

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, function(){
  console.log("Express server listening on port "+port);
  });

/*
const luo_kysymys = () => {
  pool.query("INSERT INTO kysymys (TenttiId, kysymys_teksti) VALUES ($1, $2)", [?, "Mitä vielä kysyä"], function (err, result) {
    if (err) throw err;
    console.log("kysymys lisätty");
  });


}
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

var server = https.createServer(options, app).listen(443, function(){
  console.log("Express server listening on port " + 443);
  });


/* var server = https.createServer(options, app).listen(443, function(){
  console.log("Express server listening on port " + 443);
  });
 */  /*
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