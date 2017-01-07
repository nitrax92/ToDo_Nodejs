
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
    var data = {};
    console.log("Changing list.");
    ToDoLists.find({_id: req.params.list_id}, function(err, current_list){
        console.log(current_list);


        data.current_list = current_list;

        ToDoLists.find({is_complete: false},function(err, uncomplete_lists){
            if (err)
                req.send(err);

            data.lists = uncomplete_lists;

            res.send(data)
        });
    });
});


// Delete list
app.delete('/api/todo/lists/remove/:list_id', function (req, res) {
    var data = {};
    console.log("Deleting id: " + req.param.list_id);
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
    var newTask = {task: req.body.task_description, isDone: false};
    ToDoLists.update({_id: req.body.list_id}, {$push:{tasks:newTask}}, function (err) {
        if (err)
            res.send(err);
        else
            console.log("success!")
    });




    ToDoLists.find({_id: req.body.list_id},function (err, current_list) {
        res.send(current_list);
    })

});


// Delete a task within a list.
app.delete('/api/todo/lists/tasks/:list_id/:task_id', function (req, res) {
    // Find the list
    // Find the object within the list
    // Delete the object,
    // return Updated list.



    ToDoLists.update(
        {_id:req.params.list_id},
        {$pull: {tasks: {_id: [req.params.task_id]}}},
        {},
        function (error, data) {
            if(error)
                console.log("Update error.")

            //Todo get updated list and send it back.
            ToDoLists.find({_id: req.params.list_id}, function (error, current_list) {
                current_list = current_list[0];

                res.json(current_list);
            })
        }
    );
    }
);

app.get('/api/todo/lists/tasks/status/:list_id/:task_id', function (req, res) {


    ToDoLists.update(
        {'tasks._id': req.params.task_id},
        {$set: {
            'tasks.$.isDone': true
        }}, function (err, affected_task) {

            ToDoLists.find({_id: req.params.list_id}, function (error, current_list) {
                current_list = current_list[0];

                res.json(current_list);
            })
        }
    )

});


//






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
        else if(current_list_object.is_complete || current_list_object.to_delete){
            console.log("Delete complete or list that is set for deletion..")
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
            tasks: list_object.tasks
        }}, function (err, affected_list_object){
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