'use strict';

angular.module('hexsales-client').controller('SearchCtrl', ['$scope', '$location', 'Api', function($scope, $location, Api) {

  $scope.articleList = [];

  // starts the search and routes the user to `/search/:term`
  $scope.startSearch = function() {

    // update term with suggested text from the search bar
    // if a user types in 'a' and does select a suggested text element the value of $scope.searchTerm will
    // not be updated, hence this piece of jQuery
    var term = $('#search-bar').val();
    if (!term || (typeof term === 'string' && term.length === 0)) {
      return;
    }
    $location.path('/search/' + (term || ''));
  };

  // on load: get all articles and add a completion list to the search bar
  Api.searchArticles({
      limit: 90000
    })
    .then(function(res) {

      $('#search-bar').autocomplete({
        source: res.data.map(function(e) {
          return e.name;
        })
      });

    })
    .catch(function(err) {
      console.log(err);
    });


}]);
