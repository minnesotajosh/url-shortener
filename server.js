// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
var connected=false;

var db;

var mongodb = require('mongodb');
// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;


MongoClient.connect(MONGODB_URI, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {

    // http://expressjs.com/en/starter/basic-routing.html
    app.get("/", function (request, response) {
      response.sendFile(__dirname + '/views/index.html');
    });


    app.post("/api/submitUrl", function (req, res) {
        var patt = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
        var result = patt.test(req.body.url);
        if (result) {  
          try {
            db.collection('urls').insert({url: req.body.url}, function(err,docsInserted){
              console.log(docsInserted);
              res.send(docsInserted.insertedIds[0]);
            });


            // And then we redirect the view back to the homepage
          } catch (err) {
            console.log('err', err);
            handleError(err, res);
          }
        }
    });
    
    app.get("/url/:id", function (req, res) {
      db.collection('urls').find( { _id: new ObjectId(req.params.id) } ).toArray(function(err, results) {
        res.redirect(results[0].url);
      });


    });
    
  });
});


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


function handleError(err, response) {
  response.status(500);
  response.send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
}

