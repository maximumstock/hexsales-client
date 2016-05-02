'use strict';

angular.module('hexsales-client').controller('SearchCtrl', ['$scope', '$location', 'Api', function($scope, $location, Api) {

  // starts the search and routes the user to `/search/:term`
  $scope.startSearch = function(term) {
    if(!term || (typeof term === 'string' && term.length === 0)) {
      return;
    }
    $location.path('/search/' + (term || ''));
  };

}]);
