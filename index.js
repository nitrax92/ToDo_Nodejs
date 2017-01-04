
// ============ setup ============

// Express init. framework
var express = require('express');

// Express setup
var app = express();

var mongoose = require ('mongoose'); // mongoose database
var morgan = require('morgan'); //log requests to the console
var bodyParser = require('body-parser'); //Get information from HTML POST with express
var methodOverride = require('method-override'); // DELETE and PUT with express



// Database connection string.
var uristring =
    process.env.MONGODB_URI ||
    'mongodb://db_user:123qwe@ds151228.mlab.com:51228/heroku_gxxcx978';

mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});


// ============ Configuration ============

// Static files for this project.
app.use(express.static(__dirname + '/public'));

// Log all requests to the console window.
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({'extended': 'true'})); //parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'})); //Parse application/vnd.api+json as json
app.use(methodOverride());
// set port for this app. port works as a variable.
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var cool = require('cool-ascii-faces');
app.get('/', function (request, response) {
    response.send(cool())
});



app.listen(app.get('port'), function () {
    console.log('Node.js app is running on localhost:', app.get('port'))
});