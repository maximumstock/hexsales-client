'use strict';

angular.module('hexsales-client')
  .directive('favList', ['$cookies', function($cookies) {
    return {
      scope: {
        name: '@'
      },
      template: '<button class="btn btn-default btn-xs follow-button">Favorite <span style="color: rgb(220, 20, 20);" class="glyphicon glyphicon-heart"></span></button>',
      link: function(scope, element, attrs) {

        // when the button is clicked, add the name of the article to the list in the cookie
        $(element).click(function(event) {

          var favorites = $cookies.getObject('hexsales-article-favorites') || [];

          var index = favorites.indexOf(scope.name);
          if (index === -1) {
            favorites.push(scope.name);
          } else {
            favorites.splice(index, 1);
          }
          favorites.sort();
          $cookies.putObject('hexsales-article-favorites', favorites);

        });

      }
    };
  }]);
