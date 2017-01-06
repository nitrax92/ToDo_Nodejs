/**
 * Created by Mello on 1/4/2017.
 */

var martinsToDo = angular.module('martinsTodo', ['ngAnimate']);

function mainController($scope, $http){
    $scope.formData = {};
    $scope.myFormData = {};

    $http.get('/api/todos')
        .success(function(data){
            $scope.todos = data.todo;
            $scope.uncomplete_lists = data.lists;
            $scope.current_list = data.lists[0];
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    // Submitting add form.
    $scope.createTodo = function () {
        $http.post('/api/todos', $scope.formData)
            .success(function (data) {
                $scope.formData = {}; //Clear the form.
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data){
                console.log('Error: ' + data);
            });
    };


    //New To Do Item.
    $scope.createTodo = function () {
        $http.post('/api/todos', $scope.formData)
            .success(function (data) {

                $scope.formData = {}; //Clear the form.
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data){

                console.log('Error: ' + data);
            });
    };

    // New empty to do list.
    $scope.createToDoList = function () {


      $http.post('/api/todo/lists', $scope.myFormData)
          .success(function(lists){
              console.log("New List Successfully made." + lists);
              $scope.myFormData = {};  //Clear the form
              $scope.uncomplete_lists = lists; //Returned uncomplete lists
              $scope.current_list = lists[0];
              console.log(lists)

          })
          .error(function (data) {
              console.log("New List Failed.");
              console.log('Error, could not create a new list. ' + data)
          });
    };

    // New Task within an existing list.
    $scope.createToDoListTask = function () {
        var data = {};
        // Populate list data to the scope.
        $scope.myFormData.list_id = $scope.current_list._id;
        $http.post('/api/todo/lists/tasks', $scope.myFormData)
            .success(function (data) {
                $scope.myFormData = {}; //Clear data
                $scope.current_list = data[0];
                console.log("Successfully made task to list.")
            })
            .error(function (data) {
                console.log("Some error when creating a new task." + data)
            })
    };


    $scope.deleteToDoList = function(id){
        console.log(id);
      $http.delete('/api/todo/lists/remove/' + id)
          .success(function (data){
           //Handle incomming data
            $scope.current_list = data.lists[0];
            $scope.uncomplete_lists = data.lists;
            // All remaining lists, a current chosen list.
        })
        .error(function(data){
             console.log(data);
            });
    };


    $scope.chooseToDoList = function (id) {
        $http.get('/api/todo/lists/' + id)
            .success(function (data) {
                console.log(data.current_list[0]);
                $scope.current_list = data.current_list[0];
                $scope.todos = data.todo;
                $scope.uncomplete_lists = data.lists;

            })
            .error(function (data) {
                console.log("Some error when finding list." + data);
            });
    };
    
    $scope.deleteToDoTask = function (list_id, task_id) {
        console.log(list_id);
        console.log(task_id);
        $http.delete('/api/todo/lists/tasks/' + list_id + '/' + task_id)
            .success(function (data) {
                console.log("Successfully deleted item within a list.")
                $scope.current_list = data;
            })
            .error(function (data) {
                console.log("Could not delete item within list.")
            })

    };

    $scope.completeToDoTask = function(list_id, task_id){
      $http.get('/api/todo/lists/tasks/status/' + list_id + '/' + task_id)
          .sucess(function(data){
              console.log("Successfully edited a task.")
          })
          .error(function (data) {
              console.log("Could not complete task")
          })
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}