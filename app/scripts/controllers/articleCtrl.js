'use strict';

app.controller('ArticleCtrl', ['$scope', '$location', 'Api', function($scope, $location, Api) {

  // grab all articles
  Api.searchArticles({like: true, limit: 10000})
    .then(function(res) {
      $scope.allArticles = res.data.filter(function(a) {
        return a.name !== '';
      });
      $scope.allSortedArticles = {
        cards: $scope.allArticles.filter(function(e) { return e.type === 'Card'; }),
        equipment: $scope.allArticles.filter(function(e) { return e.type === 'Equipment'; }),
        others: $scope.allArticles.filter(function(e) { return e.type !== 'Card' && e.type !== 'Equipment'; })
      };
    })
    .catch(function(err) {
      throw err;
    });

}]);
