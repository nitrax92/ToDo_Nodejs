/**
 * Created by Mello on 1/4/2017.
 */

var martinsToDo = angular.module('martinsTodo');






/*
function mainController($scope, $http){
    $scope.formData = {};
    $scope.myFormData = {};

    $http.get('/api/todos')
        .success(function(data){
            $scope.todos = data.todo;
            $scope.toDoLists = data.lists;
            console.log("Hello?");

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

    $scope.createToDoList = function () {
      $http.post('/api/todo/lists', $scope.myFormData)
          .success(function(data){
              console.log("New List Successfully made.");
              $scope.myFormData = {};  //Clear the form
              $scope.toDoLists = data; //Returned uncomplete lists
              console.log(data)

          })
          .error(function (data) {
              console.log("New List Failed.");
              console.log('Error, could not create a new list. ' + data)
          });
    };


    $scope.chooseToDoList = function (id) {
        $http.get('/api/todo/lists/' + id)
            .success(function (data) {
                console.log(data);
                $scope.toDoList = data[0];
                $scope.todos = {};
                $scope.toDoLists = {};





            })
            .error(function (data) {
                console.log("Some error when finding list." + data);
            });
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
*/