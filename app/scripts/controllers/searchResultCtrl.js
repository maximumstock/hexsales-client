'use strict';

angular.module('hexsales-client').controller('SearchResultCtrl', ['$scope', '$routeParams', '$route', 'Api', function($scope, $routeParams, $route, Api) {

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
        // filter out all cards
        $scope.sortedSearchResults = {
          cards: $scope.searchResults.filter(function(e) { return e.type === 'Card'; }),
					// equipment: $scope.searchResults.filter(function(e) { return e.type === 'Equipment'; }),
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
