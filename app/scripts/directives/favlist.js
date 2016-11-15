'use strict';

angular.module('hexsales-client')
  .directive('favList', ['$cookies', function($cookies) {
    return {
      scope: {
        name: '@',
        uuid: '@'
      },
      template: '<button class="btn btn-default btn-xs favorite-button">Favorite <span class="glyphicon glyphicon-heart"></span></button>',
      link: function(scope, element, attrs) {

        // if the current article already exists in a user's favorites, then change the heart color to indicate missing
        // favorization
        var favorites = $cookies.getObject('hexsales-article-favorites') || [];

        var duplicates = favorites.filter(function(e) {
          return e.uuid === scope.uuid;
        });
        if(duplicates.length !== 0) {
            element.children().addClass('favorite-button-favorited');
        }

        // when the button is clicked, add the name of the article to the list in the cookie
        $(element).click(function(event) {

            favorites = $cookies.getObject('hexsales-article-favorites') || favorites;

            duplicates = favorites.filter(function(e) {
                return e.uuid === scope.uuid;
            });

            if(duplicates.length === 0) {
                favorites.push({
                    name: scope.name,
                    uuid: scope.uuid
                });
                element.children().addClass('favorite-button-favorited')
            } else {
                // if the article already exists in the favorites array then remove it
                favorites = favorites.filter(function(e) {
                    return e.uuid !== scope.uuid;
                });
                element.children().removeClass('favorite-button-favorited');
            }
            
            $cookies.putObject('hexsales-article-favorites', favorites);

        });

      }
    };
  }]);
