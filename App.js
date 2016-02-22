//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');
var dispatcher = require('httpdispatcher');
var url = require("url");
var path = require("path");
var multer = require('multer');
var publicDir = process.argv[2] || __dirname + '/public';
var viewsDir = process.argv[2] || __dirname + '/client/views';
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/roseshaw';

//express related stuff
var express = require('express');
var app = express();
// Multer stuff for file upload

//var bodyParser = require('body-parser');

//app.use(multer({dest: publicDir}));
//^what is this?? why do i need app.use. why cant i just have that line down there,
//the upload one.

app.use(express.static(__dirname + 'public'));
// get an instance of router
// var router = express.Router();


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("destination found")
    cb(null, publicDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

//Lets define a port we want to listen to

const PORT = 8080;

var server = app.listen(PORT, function() {

  var host = server.address().address;
  var port = server.address().port;
  console.log("Server listening on: http://localhost:%s", port);

});

app.post('/api/photo', upload.array('file', 50), function(req, res) {
    console.log("test");
    //console.log(req.files[0].originalname);
    //res.send("You have uploaded " + req.file.originalname + " successfully")


    pg.connect(connectionString, function(err, client, done) {
      console.log("length =  " + req.files.length);
      for (i = 0; i < req.files.length ; i++){
       client.query("INSERT INTO items(text, complete) values($1, $2)", [req.files[i].originalname, true]);
      }

      var results = [];

      var query = client.query("SELECT * FROM items ORDER BY id ASC");

      // Stream results back one row at a time
      query.on('row', function(row) {
          results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
          done();
          console.log(results);
          return res.json(results);
      });

    });
    


});

//if i omit this line i get an error "CANNOT USE GET/" shown in the browser
//app.use('/', router);
//home index page
app.get('/', function(req, res) {
    res.sendFile(path.join(viewsDir + "/index.html"));
    //res.send('Hello World!');
});

app.get('/test', function(req, res) {
    res.sendFile(path.join(publicDir + '/IMG_3801.JPG'));
});

