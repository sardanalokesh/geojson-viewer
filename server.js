var express = require('express'); 
var path = require('path');
var fs = require('fs');

var app = express();
var http = require('http').Server(app);

// Add headers
app.use(function (req, res, next) {

	//res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/points', express.static(path.join(__dirname, 'points')));
//app.use('/data', express.static(path.join(__dirname, 'data')));
app.use('/all', express.static(path.join(__dirname, 'all')));

http.listen(3100, function(){ 
	console.log('listening on *:3100'); 
});