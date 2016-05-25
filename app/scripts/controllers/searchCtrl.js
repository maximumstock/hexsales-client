'use strict';

angular.module('hexsales-client').controller('SearchCtrl', ['$scope', '$location', 'Api', function($scope, $location, Api) {

  // starts the search and routes the user to `/search/:term`
  $scope.startSearch = function(term) {
    if(!term || (typeof term === 'string' && term.length === 0)) {
      return;
    }
    $location.path('/search/' + (term || ''));
  };

	// on load: get all articles and add a completion list to the search bar
	Api.searchArticles({limit: 90000})
		.then(function(res) {
			console.log(res.data);
			res.data.forEach(function(article) {
				$('#articleNameList').append('<option value="' + article.name + '">');
			});
		})
		.catch(function(err) {
			console.log(err);
		});


}]);
