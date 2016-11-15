'use strict';

angular.module('hexsales-client').controller('SearchCtrl', ['$scope', '$location', 'Api', function($scope, $location, Api) {

  $scope.articleList = [];

  // starts the search and routes the user to `/search/:term`
  $scope.startSearch = function(term) {

    var term = term || $('#search-bar').val();

    if (!term || (typeof term === 'string' && term.length === 0)) {
      return;
    }
    
      var foundItems = $scope.articleList.filter(function(item) {
          return item.name === term;
      });

      if(foundItems.length === 1) {
          return $location.path('/articles/'+foundItems[0].uuid);
      } else {
          return $location.path('/search/'+(term || ''));
      }
  };

  // on load: get all articles and add a completion list to the search bar
  Api.searchArticles({
      limit: 90000
    })
    .then(function(res) {

        $scope.articleList = res.data;
      $('#search-bar').autocomplete({
        source: res.data.map(function(e) {
          return e.name;
        }),
        select: function(event, ui) {
            $scope.startSearch(ui.item.name);
        }
      });

    })
    .catch(function(err) {
      console.log(err);
    });


}]);
