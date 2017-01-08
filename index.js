
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
app.use('/views', express.static(__dirname + '/public/views'));

// Load md-data-table to static available content
app.use('/static/md-data-table',express.static(__dirname + '/node_modules/md-data-table/dist'));
app.use('/static/js/move', express.static(__dirname + '/node_modules_array.prototype.move/src/'));

/*
var todoSchema = Schema({
   text: String,

});
*/
// Project Models
var Todo = mongoose.model('Todo', {
    text: String
});


var ToDoLists = mongoose.model('Todo_lists',

    //Schema
    {
    list_name: String,
    is_complete: Boolean,
    tasks:[{task: String, is_done:Boolean}]
    }
);





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




// ************************** Angular Data Handling ****************************
app.post('/api/list/savechanges', function (req, res) {
    console.log("Saving changes..");

    // req.body = list of objects.

    // Itterate through the list, update existing, add new.
    for(var i = 0; i<req.body.length; i++){
        console.log(i + ' - ' + req.body[i].list_name);

        current_list_object = req.body[i];

        if(req.body[i].is_local){
            console.log("Local list found, create a new object in database.");
            createNewList(current_list_object)

        }

        // Delete all completed lists?
        else if(current_list_object.to_delete){
            console.log("Delete complete or list that is set for deletion..")
            deleteList(current_list_object)
        }
        else{
            console.log("EXISTING LIST");
            updateList(current_list_object)
        }
    }

});

// Update a single task in a list.
function updateTasks(list_id, task_object){
    console.log("Updating tasks.")
}

// Delete a single task from a list
function deleteTask(list_id, task_id){

}

//Create new List entry.
function createNewList(list_object){
    ToDoLists.create(
        {
            list_name: list_object.list_name,
            is_complete: list_object.is_complete,
            tasks: list_object.tasks
        }, function (err, new_list_object) {
            if (err){
                console.log(err)
            }
        }
    )
}

// Update existing list object.
function updateList(list_object){
    ToDoLists.update(
        {_id:list_object._id},
        {$set: {
            tasks: list_object.tasks,
            is_complete: list_object.is_complete
        }}, function (err, updated_list_object){
            if (err)
                console.log(err)
        }
    )
}


function deleteList(list_object){
    ToDoLists.remove(
        {_id: list_object._id},
        function (err, deleted_object) {
            if (err)
                console.log(err)
        }
    )
}




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