
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

// public content, everything frontend
app.use(express.static(__dirname + '/public'));

// Load md-data-table to static available content
app.use('/static/md-data-table',express.static(__dirname + '/node_modules/md-data-table/dist'));

/*
var todoSchema = Schema({
   text: String,

});
*/
// Project Model
var Todo = mongoose.model('Todo', {
    text: String
})



// Routes

// API

// Get all
app.get('/api/todos', function (req, res) {

    // Get all todos in the database
    Todo.find(function(err, all_todos){
        if(err)
            res.send(err);

        res.json(all_todos); //Return all objects in a JSON format.
    });
});



// Create a new entry and send back all after creation.
app.post('/api/todos', function (req,res) {
    Todo.create({
        text:req.body.text,
        done:false
    }, function (err, todo) {
        if (err)
            res.send(err);


        // Get and return all todos
        Todo.find(function (err, all_todos) {
            if(err)
                req.send(err);

            res.json(all_todos);
        });
    });
});


// Delete entry.
app.delete('/api/todos/:todo_id', function (req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);

        // Get and return all entries again.
        Todo.find(function(err, all_todos){
            if (err)
                res.send(err);

            res.json(all_todos);
        })
    })
});




// Application
app.get('*', function (req,res) {
    res.sendfile('index.html')
})

var cool = require('cool-ascii-faces');
app.get('/', function (request, response) {
    response.send(cool())
});



app.listen(app.get('port'), function () {
    console.log('Node.js app is running on localhost:', app.get('port'))
});