/**
 * Created by Mello on 1/4/2017.
 */

// Express init. framework
var express = require('express');

// Express setup
var app = express();

// set port for this app. port works as a variable.
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var cool = require('cool-ascii-faces');
app.get('/', function (request, response) {
    response.send(cool())
})



app.listen(app.get('port'), function () {
    console.log('Node.js app is running on localhost:', app.get('port'))
});