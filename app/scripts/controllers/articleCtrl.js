'use strict';

app.controller('ArticleCtrl', ['$scope', '$location', 'Api', function($scope, $location, Api) {

  // grab all articles
  Api.searchArticles({like: true, limit: 10000})
    .then(function(res) {
     
			var relevantArticles = res.data.filter(function(a) {
				return a.name !== '';
			});

			// append elements
			var cards = relevantArticles.filter(function(a) {
				return a.type === 'Card';
			});
			var cardList = document.getElementById('card-list');
			cards.forEach(function(c) {
				
				$(cardList).append('<li><a href="#/articles/' + c.name + '">' + c.name + ' [ ' + c.rarity[0] + ' - ' + c.setid + ' ]' + '</a></li>');

			});
			$scope.allArticles = res.data.filter(function(a) {
			  return a.name !== '';
			});
			$scope.allSortedArticles = {
			  // cards: $scope.allArticles.filter(function(e) { return e.type === 'Card'; }),
			  equipment: $scope.allArticles.filter(function(e) { return e.type === 'Equipment'; }),
			  others: $scope.allArticles.filter(function(e) { return e.type !== 'Card' && e.type !== 'Equipment'; })
			};
    })
    .catch(function(err) {
      throw err;
    });

}]);
