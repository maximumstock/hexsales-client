'use strict';

angular.module('hexsales-client').controller('SearchResultCtrl', ['$scope', '$routeParams', '$route', '$location', 'Api', function($scope, $routeParams, $route, $location, Api) {

  $scope.term = $routeParams.term || '';

  $scope.search = function(term) {

    var searchParams = {
      name: term,
      limit: 10000000 // over 9000
    };

    Api.searchArticles(searchParams)
      .success(function(result) {
        $scope.searchResults = result.filter(function(e) {
          // filter out all without a name
          return e.name !== null;
        });

		// if there is only one result, redirect immediately;
		if($scope.searchResults.length === 1) {
			$location.path('/articles/' + $scope.searchResults[0].uuid);
		}

        // filter out all cards
        $scope.sortedSearchResults = {
            cards: $scope.searchResults.filter(function(e) { return e.type === 'Card'; }),
		    equipment: $scope.searchResults.filter(function(e) { return e.type === 'Equipment'; }),
            others: $scope.searchResults.filter(function(e) { return e.type !== 'Card' && e.type !== 'Equipment'; })
        };
      })
      .error(function(error) {
        // @TODO handle connection error
        console.log(error);
      });

  };

  $scope.search($scope.term);

}]);
