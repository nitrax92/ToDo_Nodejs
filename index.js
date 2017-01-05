
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
// Project Models
var Todo = mongoose.model('Todo', {
    text: String
});


var ToDoLists = mongoose.model('Todo_lists', {
    list_name: String,
    is_complete: Boolean,
    time : { type : Date, default: Date.now },
    tasks:[{task: String, isDone:Boolean}]
});





// Routes

// API

// Get all
app.get('/api/todos', function (req, res) {
    var data = {};
    // Get all todos in the database
    Todo.find(function(err, all_todos){
        if(err)
            res.send(err);

        data.todo = all_todos;
        ToDoLists.find(function (err, all_lists) {
            if (err)
                res.send(err);

            data.lists = all_lists;
            res.json(data);
        });
        //res.json(all_todos); //Return all objects in a JSON format.
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



// Create a new List
app.post('/api/todo/lists', function (req, res) {
    ToDoLists.create({
        list_name:req.body.list_name,
        is_complete:false
    }, function (err, todo_lists) {
        if (err)
            req.send(err);

        //Get all uncomplete lists.
        ToDoLists.find({is_complete: false},function(err, uncomplete_lists){
            if (err)
                req.send(err);

            res.json(uncomplete_lists)
        });
        //Get all uncomplete lists.

    })
});


// Change chosen list.
app.get('/api/todo/lists/:list_id', function (req, res) {
    ToDoLists.find({_id: req.params.list_id}, function(err, current_list){
        console.log(current_list);


        data.current_list = current_list;

        ToDoLists.find({is_complete: false},function(err, uncomplete_lists){
            if (err)
                req.send(err);

            data.lists = uncomplete_lists;
            res.json(data)
        });
    });
});

app.delete('/api/todo/lists/:list_id', function (req, res) {
    ToDoLists.remove({
        _id : req.params.list_id
    }, function (err, list) {
        if (err)
            res.send(err);


        ToDoLists.find(function (err, all_lists) {
            if (err)
                res.send(err);

            data.lists = all_lists;
            res.json(data);
        });

    });
});

// Create new task within a list.
app.post('/api/todo/lists/tasks', function (req, res) {
   // Get the list form the ID.

    //req.body.current_list.tasks.push({task: req.body.task_description, is_done: false});
    var newTask = {task: req.body.task_description, is_done: false};
    ToDoLists.update({_id: req.body.list_id}, {$push:{tasks:newTask}}, function (err) {
        if (err)
            res.send(err);
        else
            console.log("success!")
    });




    ToDoLists.find({_id: req.body.list_id},function (err, current_list) {
        console.log(current_list);
        //current_list = current_list[0];
        //var newTask = {task: req.body.task_description, is_done: false};
        //current_list.tasks.push(newTask);
        //console.log(current_list);

        //ToDoLists.update(current_list);
        //current_list.tasks.push({task: req.body.task_description, is_done: false});
        //current_list.tasks.add({task: req.body.task_description, is_done: false});
    })

});

app.delete('/api/todo/lists/tasks/:list_id,task_name'), function (req, res) {
    ToDoLists.find({_id: req.params.list_id}, function (err, current_list) {
        current_list.tasks.find({task:req.params.task_name})
    })
};


// Delete entry.
app.delete('/api/todos/:todo_id', function (req, res) {
    console.log(req.params.todo_id);
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
});

var cool = require('cool-ascii-faces');
app.get('/', function (request, response) {
    response.send(cool())
});



app.listen(app.get('port'), function () {
    console.log('Node.js app is running on localhost:', app.get('port'))
});