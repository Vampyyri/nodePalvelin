'use strict';


var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
const { application } = require('express');

var port = 3004;

var options = {
    key: fs.readFileSync('./server-key.pem', 'utf8'),
    cert: fs.readFileSync('./server-cert.pem', 'utf8'),
};

var app = express();
var tietoja = fs.readFileSync('db.json');
var tiedot = JSON.parse(tietoja);

app.get('/', function (req, res) {
  fs.readFile('./db.json', "utf8", function(err, data) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(data);
    console.log(data)
    res.end();
    });
  })


var s_server = https.createServer(options, app).listen(port, '', null, function()  {

  var host = this.address().address;
  var port = this.address().port;
  console.log('listening at http://%s:%s', host, port);
  console.log("Express server listening on port " + port)
  
})
   
app.get('/', function (req, res) {

  
  res.contentType('application/json');
  res.send(util.inspect(req.socket.getPeerCertificate(true), {colors: true}));
  console.log(util.inspect(req.socket.getPeerCertificate(true)))
});

  




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
