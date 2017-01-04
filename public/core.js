/**
 * Created by Mello on 1/4/2017.
 */

var martinsToDo = angular.module('martinsTodo', []);

function mainController($scope, $http){
    $scope.formData = {};

    $http.get('/api/todos')
        .success(function(data){
            $scope.todos = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        })

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


}

