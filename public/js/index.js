var App = angular.module('App', []);

App.controller('DisplayController', function($scope, $http, $timeout) {
    $scope.added = [];
    $scope.isSearching = false;
    $scope.showIngredients = true;
    $scope.showRecipes = false;
    $scope.isAppOutline = true;
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
        $http.get('/getRecipes', {params: { food: $scope.added }}).success(function(recipes) {
            console.log(recipes.matches)
            $scope.recipes = recipes.matches
            $scope.showIngredients = false;
            $scope.showRecipes = true;
            $scope.isAppOutline = false;

        });
    };

    $scope.dropDown = function() {
        $scope.isSearching = false;
    }

    $scope.addIngredient = function(ingredient) {
        $scope.added.push(ingredient);
    };



    // This is what you will bind the filter to
    $scope.filterText = '';

    // Instantiate these variables outside the watch
    var tempFilterText = '',
        filterTextTimeout;
    $scope.$watch('searchText', function (val) {
        if (filterTextTimeout) $timeout.cancel(filterTextTimeout);
        if (val != undefined) {
            if (val.length >= 2) $scope.isSearching = true;
            if (val.length < 2) $scope.isSearching = false;
        }


        tempFilterText = val;
        filterTextTimeout = $timeout(function() {
            $scope.filterText = tempFilterText;
        }, 250); // delay 250 ms
    })
});

 App.filter('partition', function() {
  var cache = {};
  var filter = function(arr, size) {
    if (!arr) { return; }
    var newArr = [];
    for (var i=0; i<arr.length; i+=size) {
      newArr.push(arr.slice(i, i+size));
    }
    var arrString = JSON.stringify(arr);
    var fromCache = cache[arrString+size];
    if (JSON.stringify(fromCache) === JSON.stringify(newArr)) {
      return fromCache;
    }
    cache[arrString+size] = newArr;
    return newArr;
  };
  return filter;
});