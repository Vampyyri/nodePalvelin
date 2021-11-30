const express = require("express");
//const app = express();
let fs = require ("fs");
const port = 3001;
var app = express();
const morgan = require("morgan");
app.use(morgan(':method :url :status :total-time[4] ms:body'))
//app.use("fs");



let omatTentit = [{
  "tentit": [
    {
      "id": 0,
      "otsikko": "Tentti 1",
      "kysymykset": [
        {
          "teksti": "Mitä muuttujan näkyvyysalue tarkoittaa?",
          "vastaukset": [
            {
              "teksti": "Sitä, kuinka kaukaa muuttuja näkyy ilman kaukoputkea tai kiikareita",
              "valittu": false
            },
            {
              "teksti": "Sitä, missä kohtaa ohjelmaa muuttujaa voi käyttää",
              "valittu": false
            },
            {
              "teksti": "Sitä, miten helppo muuttujien käyttöä on synkronoida säikeiden kesken",
              "valittu": false
            },
            {
              "teksti": "Sitä, miten helppo muuttujia on käyttää eri ohjelman osista",
              "valittu": false
            },
            {
              "teksti": "Sitä, miten helppo muuttujien käyttöä on synkronoida säikeiden kesken",
              "valittu": false
            }
          ]
        },
        {
          "teksti": "MLuokkien hyvä puoli on, että",
          "vastaukset": [
            {
              "teksti": "niiden avulla koodia on helpompi moduloida",
              "valittu": false
            },
            {
              "teksti": "niden avulla on helppo uudelleenkäyttää ohjelmakoodia",
              "valittu": false
            },
            {
              "teksti": "Sniiden avulla on helppo kirjoittaa koodia, joka tukee hyvin kompositiota",
              "valittu": false
            },
            {
              "teksti": "ne tarjoavat hyvän abstraktion kaikkeen mahdolliseen",
              "valittu": false
            },
            {
              "teksti": "niiden avulla on helppo kirjoittaa monisäikeisiä sovelluksia",
              "valittu": false
            }
          ]
        }
      ]
    },
    {
      "id": 1,
      "otsikko": "Tentti 2",
      "kysymykset": [
        {
          "teksti": "Paljonko on kaksi kertaa kaksi?",
          "vastaukset": [
            {
              "teksti": "Kolme",
              "valittu": true
            },
            {
              "teksti": "Kaksi",
              "valittu": false
            },
            {
              "teksti": "Kolme",
              "valittu": true
            },
            {
              "teksti": "Nolla",
              "valittu": false
            },
            {
              "teksti": "Nelja",
              "valittu": true
            },
            {
              "teksti": "Viisi",
              "valittu": false
            }
          ]
        },
        {
          "teksti": "Luokkien huono puoli on, että",
          "vastaukset": [
            {
              "teksti": "niiden avulla koodia on helpompi moduloida",
              "valittu": false
            },
            {
              "teksti": "niden avulla on helppo uudelleenkäyttää ohjelmakoodia",
              "valittu": false
            },
            {
              "teksti": "Sniiden avulla on helppo kirjoittaa koodia, joka tukee hyvin kompositiota",
              "valittu": false
            },
            {
              "teksti": "ne tarjoavat hyvän abstraktion kaikkeen mahdolliseen",
              "valittu": false
            },
            {
              "teksti": "niiden avulla on helppo kirjoittaa monisäikeisiä sovelluksia",
              "valittu": false
            },
            {
              "teksti": "afdfsgsrg",
              "valittu": false
            }
          ]
        },
        {
          "teksti": "Mitä vielä kysyä?",
          "vastaukset": []
        },
        {
          "teksti": "Mitä vielä kysyä?",
          "vastaukset": []
        },
        {
          "teksti": "Mitä vielä kysyä?",
          "vastaukset": []
        },
        {
          "teksti": "Mitä vielä kysyä?",
          "vastaukset": []
        },
        {
          "teksti": "Mitä vielä kysyä?",
          "vastaukset": []
        },
        {
          "teksti": "Mitä vielä kysyä?",
          "vastaukset": []
        }
      ]
    }
  ]
}];

morgan.token("body", function(request) {
  return JSON.stryngify(request.body)
})

app.post('/', (req, res)  => {
  console.log(req.body)
  let data = JSON.stringify(omatTentit)

  fs.("omatTentit.txt", data, {encoding: "utf8"}, function(err) {
    if (err) throw err;
    console.log("Saved!")
  });
 
    res.end()

});

app.get('/', (req, res)  => {
  fs.readFile('omatTentit.txt', {encoding: "utf8"}, function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.write(data);
    res.end();
  });
});



app.listen(port, () => {
  console.log("listening")
})


 
/*
app.get('/', (req, res)  => {
  res.send({tentti:"Tentti 1", kysymykset:[]});
});
*/



//let omatTentit = [];
/*

*/




/*
http.createServer(function(req, res) {
  fs.readFile("demo.html", function(err, data) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(data);
    return res.end();
  });
}).listen(3001)



fs.appendFile("uusiTiedosto.txt", "Hello content!", function(err) {
  if (err) throw err;
  console.log("Saved!")
})




var express = require('express');
const morgan = require('morgan');
var app = express();
const port = 3001

const fn1 = (req, res, next) => {
  console.log("Näin lisätään")
}
omatTentit = []

app.get('/tentit', (req, res, next)  => {
  res.send({tentti:"Tentti 1", kysymykset:[]});
});

app.get('/tentit/:id', (req, res)  => {
  res.send({tentti:"Tentti 1", kysymykset:[]});
});

app.get('/tentit/:id/kysymykset', (req, res)  => {
  res.json({kysymykset:[]});
});

app.post('/tentit', (req, res)  => {
  res.send({kysymykset:[]});
});


app.post('http://localhost:3001/tentit/:id', (req, res)  => {
    console.log(req.params.id);
    res.json({tentti:"Tentti 1", kysymykset:[]});
  });

  app.put('http://localhost:3001/tentit/:id', (req, res)  => {
    console.log(req.params.id);
    res.json({tentti:"Tentti 1", kysymykset:[]});
  });

app.listen(port, () => {
    console.log("listening")
})



app.get('/api/tentit/:id', (request, response) => {
  const id = Number(request.params.id);

  const tentti = tentit.find(tentti => tentti.id === id);

  

 */

  //json-server --watch db.json --port 3004

 