'use strict';

angular.module('hexsales-client')
  .directive('favList', ['$cookies', function($cookies) {
    return {
      scope: {
        name: '@',
        uuid: '@'
      },
      template: '<button class="btn btn-default btn-xs follow-button">Favorite <span style="color: rgb(220, 20, 20);" class="glyphicon glyphicon-heart"></span></button>',
      link: function(scope, element, attrs) {

        // when the button is clicked, add the name of the article to the list in the cookie
        $(element).click(function(event) {

            var favorites = $cookies.getObject('hexsales-article-favorites') || [];

            var duplicates = favorites.filter(function(e) {
                return e.uuid === scope.uuid;
            });

            if(duplicates.length === 0) {
                favorites.push({
                    name: scope.name,
                    uuid: scope.uuid
                });
            } else {
                // if the article already exists in the favorites array then remove it
                favorites = favorites.filter(function(e) {
                    return e.uuid !== scope.uuid;
                });
            }
            
            $cookies.putObject('hexsales-article-favorites', favorites);

        });

      }
    };
  }]);
