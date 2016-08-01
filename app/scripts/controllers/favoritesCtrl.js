'use strict';

angular.module('hexsales-client')
  .controller('FavoritesCtrl', ['$scope', '$cookies', '$location', 'Api', function($scope, $cookies, $location, Api) {

    $scope.clearFavorites = function() {
      $cookies.putObject('hexsales-article-favorites', []);
      $scope.update();
    }

    $scope.update = function() {

      $scope.favorites = $cookies.getObject('hexsales-article-favorites');

      Api.getPricelist()
        .then(function(res) {
          $scope.pricelist = res.data;
          $scope.favoritesPrices = $scope.favorites.map(function(article) {

            var data = {
              name: article,
              prices: [[], []] // plat, gold
            };

            ['platinum', 'gold'].forEach(function(currency) {

              if(!$scope.pricelist[currency][article]) {
                return;
              }

              var obj = $scope.pricelist[currency][article];
              var keys = Object.keys(obj);
              keys.forEach(function(k) {

                data.prices[currency === 'platinum' ? 0 : 1].push({
                  currency: currency,
                  price: numeral(obj[k].a).format('0,0'),
                  min: numeral(obj[k].mi).format('0,0'),
                  max: numeral(obj[k].ma).format('0,0'),
                  quantity: numeral(obj[k].q).format('0,0'),
                  description: 'last ' + k + ' days'
                });

              });

            });

            return data;

          });

        })
        .catch(function(err) {
          console.log(err);
          // @TODO handle error
        });
    };

    $scope.update();

  }]);
