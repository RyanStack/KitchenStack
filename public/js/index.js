var App = angular.module('App', []);

App.controller('DisplayController', function($scope, $http, $timeout) {
    $scope.index = null; // row index
    $scope.added = {};
    $scope.keys = [];
    $scope.finalSet = [];
    $scope.isSearching = false;
    $scope.showIngredients = true;
    $scope.showRecipes = false;
    $scope.isAppOutline = true;
    $scope.searchText;
    $scope.hasSearched = false;
    $scope.filteredEntryLength;
    $http.get('/data').then(function(result) {
        var words = result.data;
        var nofirst = words.substring(1);
        var noLast = nofirst.substring(0, nofirst.length - 1);
        var noDups = [];
        var foodIngredientsArray = noLast.split("\\n");
        var b = {};
        for (var i = 0; i < foodIngredientsArray.length; i++) {
            b[foodIngredientsArray[i]] = foodIngredientsArray[i];
        }
        var c = [];
        for (var key in b) {
            c.push(key);
        }
        $scope.entries = c
    });

    $scope.submitIngredients = function() {
        console.log($scope.added)
        $scope.finalSet = [];
        for (key in $scope.added) {
            if ($scope.added[key] == true) {
                $scope.finalSet.push(key)
            }
        }
        $http.get('/getRecipes', {params: { food: $scope.finalSet }}).success(function(recipes) {
            console.log(recipes.matches)
            $scope.recipes = recipes.matches
            $scope.showIngredients = false;
            $scope.showRecipes = true;
            $scope.isAppOutline = false;
            $scope.hasSearched = true;

        });
    };

    $scope.adjustIngredients = function() {
        $scope.showIngredients = true;
        $scope.showRecipes = false;
        $scope.hasSearched = false;
    };

    $scope.dropDown = function() {
        $scope.isSearching = false;
    }

    $scope.addIngredient = function(ingredient) {
        $scope.added[ingredient] = true;
        $scope.keys.push(ingredient)
        $scope.searchText = "";

    };

    $scope.change = function(item) {
        console.log("made it to change")
        console.log(item)
        for (keys in $scope.added ) {
            if (keys == item) {
                $scope.added[keys] = !($scope.added[keys]);
                console.log($scope.added[keys])
            }
        }
    }



// ------- Code for traversing the live search drop down ------ //

    $scope.keypress = function(offset) {
        console.log('keypress', offset);
        if ($scope.index == null && offset == 1) {
            $scope.index = 0;
            // $scope.searchText = $scope.filteredEntryLength[$scope.index]
        }
        else if ($scope.index == null && offset == -1) {
            $scope.index = 9;
            // $scope.searchText = $scope.filteredEntryLength[$scope.index]
        }
        else {
            $scope.index = $scope.index + offset;
            // $scope.searchText = $scope.filteredEntryLength[$scope.index]
            console.log($scope.filteredEntryLength.length)
            if ($scope.index < 0) {
                $scope.index = $scope.filteredEntryLength.length
                // $scope.searchText = $scope.filteredEntryLength[$scope.index]
            }
            if ($scope.index >= $scope.filteredEntryLength.length) {
                $scope.index = 0;
                // $scope.searchText = $scope.filteredEntryLength[$scope.index]
            }
            console.log($scope.index)
        }
    };

    $scope.onKeyDown = function ($event) {
      if ($event.which === 38) {
        $scope.keypress(-1);
      }
    };

    $scope.onKeyUp = function ($event) {
      if ($event.which === 40) {
        $scope.keypress(1);
      }
    };

    $scope.onKeyPress = function ($event, value) {
        console.log(value)
      if ($event.which == 13) {
        console.log("checking index")
        if ($scope.index == null) {
           $event.preventDefault();
        }
        else {
        var foodToAdd = $scope.filteredEntryLength[$scope.index]
        $scope.addIngredient(foodToAdd)
        $event.preventDefault();
        }
      }
    };

    // $scope.hoverInSearch = function() {
    //     $scope.index = null;
    // }

    $scope.keepIndex = function(row, food) {
        console.log(row)
        $scope.index = row;
        // $scope.searchText = food
        // $scope.searchText = food;
    }

//---------------------------------------------------------------

    // This is what you will bind the filter to
    $scope.filterText = '';

    // Instantiate these variables outside the watch
    var tempFilterText = '',
        filterTextTimeout;
    $scope.$watch('searchText', function (val) {
        if (filterTextTimeout) $timeout.cancel(filterTextTimeout);
        if (val != undefined) {
            if (val.length >= 2) $scope.isSearching = true;
            if (val.length < 2) {
                $scope.isSearching = false;
                $scope.index = null;
            }
        }

        // var lengthCheck = tempFilterText.length
        // if (val.slice(0,lengthCheck) != tempFilterText) {
        //     tempFilterText = tempFilterText
        // }
        // else if (val.length == undefined) {
        //     tempFilterText = ""
        // }
        // else {
        //     tempFilterText = val;
        // }

        tempFilterText = val;
        console.log(tempFilterText)

        filterTextTimeout = $timeout(function() {
            $scope.filterText = tempFilterText;
        }, 250); // delay 250 ms
    })
});

//  App.filter('partition', function() {
//   var cache = {};
//   var filter = function(arr, size) {
//     if (!arr) { return; }
//     var newArr = [];
//     for (var i=0; i<arr.length; i+=size) {
//       newArr.push(arr.slice(i, i+size));
//     }
//     var arrString = JSON.stringify(arr);
//     var fromCache = cache[arrString+size];
//     if (JSON.stringify(fromCache) === JSON.stringify(newArr)) {
//       return fromCache;
//     }
//     cache[arrString+size] = newArr;
//     return newArr;
//   };
//   return filter;
// });