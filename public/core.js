/**
 * Created by Mello on 1/4/2017.
 */

var martinsToDo = angular.module('martinsTodo', ['ngAnimate']);

function mainController($scope, $http){
    $scope.formData = {};
    $scope.myFormData = {};

    // All lists
    $scope.lists = {};
    $scope.current_list_index = 0;
    $scope.current_list_details = {percentage: 0, completed_tasks: 0, uncomplete_tasks: 0};








    function updateListStatus (list, status) {
        var index;
        $scope.lists.some(function(entry, i){
            if(entry == list){
                index = i;
                return true;
            }
        });


        console.log(index);
        if (index >= 0)
            $scope.lists[index].is_complete = status;
            //Mark list as updated by date.

    }


    //Update list details.
    function currentListDetails(current_list){
        var complete = 0;
        var uncomplete = 0;
        var percentage = 0;
        for (var i = 0; i<current_list.tasks.length; i++){
            if(current_list.tasks[i].is_done){
                complete++;
            }
            else{
                uncomplete++;
            }
        }
        if(current_list.tasks.length)
            percentage = Math.round((complete / current_list.tasks.length)*100);

            if(percentage==100){
                updateListStatus(current_list, true);
                //$scope.current_list.is_done=true;
            }
            else{
                updateListStatus(current_list, false);
            }


        $scope.current_list_details = {percentage: percentage, completed_tasks:complete, uncomplete_tasks: uncomplete};
    }


    // Get the object with the latest updated date.
    function lastUpdatedListIndex(list){
        var currentIndex = 0;
        var currentLatestDate = 0;

        for(var i = 0; i<list.length; i++){
            console.log(list[i].timestamp_updated);
            if(list[i].timestamp_updated > currentLatestDate){
                console.log(i);
                currentIndex = i;
                currentLatestDate = list[i].timestamp_updated
            }
        }

        return currentIndex;
    }



    // Move object from one index to another.
    // Code from http://www.w3resource.com/javascript-exercises/javascript-array-exercise-38.php
    function move(arr, old_index, new_index) {
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            var k = new_index - arr.length;
            while ((k--) + 1) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    }


    $http.get('/api/todos')
        .success(function(data){
            $scope.todos = data.todo;
            $scope.uncomplete_lists = data.lists;
            $scope.lists = data.lists;
            $scope.current_list = data.lists[0];


            console.log("***** Latest Index****");
            console.log(lastUpdatedListIndex($scope.lists));
            var last_used_list = lastUpdatedListIndex($scope.lists);
            if(last_used_list){
                $scope.current_list = data.lists[last_used_list];
            }else{
                $scope.current_list = data.lists[0];
            }

            currentListDetails($scope.current_list)
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    $scope.myFilter = function (item) {
        if (item.to_delete)
            return false;
        else
            return true;
    };

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


    // ***************** Working with the local data ****************************
    $scope.addList = function () {
        console.log("Adding List!!");
        var listObject = {list_name: $scope.myFormData.list_name, is_complete:false, timestamp_updated:Math.floor(Date.now() / 1000) , tasks: [], is_local:true};
        $scope.myFormData = {};
        $scope.lists.push(listObject);
        $scope.uncomplete_lists = $scope.lists;

        console.log($scope.lists)
    };

    $scope.changeList = function (list_object) {
        var index;
        $scope.lists.some(function(entry, i){
            if(entry == list_object){
                console.log(entry.list_name);
                index = i;
                return true;
            }
        });

        if(index >= 0){
            // Move array at index to position 0
            // Remove from the current positon
            //$scope.lists.move($scope.lists, index, 0)

            $scope.lists = move($scope.lists, index, 0);
            $scope.current_list = $scope.lists[0];
            $scope.lists[0].timestamp_updated = Math.floor(Date.now() / 1000);
            console.log($scope.current_list);

            currentListDetails($scope.current_list);
            //console.log($scope.current_list.list_name);
        }
    };

    $scope.saveChanges = function () {
        console.log("Saving Changes!!");


        $http.post('/api/list/savechanges' , $scope.lists)
            .success(function (data) {
                console.log("SaveChanges success.")
        })
            .error(function(data){
                console.log(data)
        });
    };

    $scope.addTask = function () {
        if ($scope.myFormData.task_name){
            console.log($scope.myFormData.task_name);
            var task_object = {task: $scope.myFormData.task_name, is_done:false};
            $scope.myFormData = {};
            $scope.current_list.tasks.push(task_object);

            // Edit existing list object to match updated current_list
            //$scope.lists.find({list_name: current_list.list_name});
            var index;
            $scope.lists.some(function(entry, i){
                if(entry == $scope.current_list){
                    console.log(entry.list_name);
                    index = i;
                    return true;
                }
            });
            $scope.lists[index] = $scope.current_list;
            currentListDetails($scope.current_list);
            console.log($scope.current_list)
        }


    };

    $scope.dateTest = function(){
      console.log("********************* DATE TEST ******************************");
      $scope.date = new Date();
      console.log(Date.parse(s))
    };

    $scope.deleteTask = function (task) {
        var index;

        $scope.current_list.tasks.some(function(entry, i){
            if(entry == task){
                index = i;
                return true;
            }
        });


        console.log(index);
        if (index >= 0)
            $scope.current_list.tasks.splice(index, 1);
            currentListDetails($scope.current_list)
    };

    $scope.deleteList = function (list){
        var index;

        $scope.lists.some(function(entry, i){
            if(entry == list){
                index = i;
                return true;
            }
        });

        if (index >= 0)
            $scope.lists[index].to_delete = true;

        if ($scope.current_list == $scope.lists[index]){
            var remaining_lists = [];

            $scope.lists.some(function(entry, i){
                if(!entry.to_delete){
                    remaining_lists.push(entry);
                }
            });

            console.log(remaining_lists);


            if (remaining_lists.length >0){
                $scope.current_list = remaining_lists[0];
            }
            else{
                // No lists made.
                // Todo: handle case where no lists remain.
                // Option 1, unable to delete if there is only 1 list remaining?
            }
        }

    };


    
    $scope.taskStatus = function (task) {
        var index;

        $scope.current_list.tasks.some(function(entry, i){
            if(entry == task){
                index = i;
                return true;
            }
        });

        if(index >= 0){
            $scope.current_list.tasks[index].is_done ^=true;
            console.log("Change?" + $scope.current_list.tasks[index].is_done);
            currentListDetails($scope.current_list)
        }


    };




    // **********************************************************************************

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
                //$scope.uncomplete_lists = data.lists;

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

