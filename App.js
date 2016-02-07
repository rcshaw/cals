//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');
var url = require("url");
var path = require("path");
var publicDir = process.argv[2] || __dirname + '/public';


//express related stuff
var express = require('express');
var app = express();
// get an instance of router
var router = express.Router();

//Lets define a port we want to listen to
const PORT=8080; 
app.listen(PORT);

//if i omit this line i get an error "CANNOT USE GET/" shown in the browser
app.use('/', router);

router.get('/test', function(req, res) {
  res.sendFile(path.join(publicDir + '/IMG_3801.JPG'));
});

app.use(express.static(__dirname + 'public'));