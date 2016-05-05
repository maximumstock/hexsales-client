'use strict';

angular.module('hexsales-client')
  .controller('DailyReportCtrl', ['$scope', 'Api', function($scope, Api) {

    function getMostSoldArticles(params) {

      Api.getMostSoldArticles(params)
        .then(function(res) {

          $scope.mostSoldArticles = [];

          var keys = Object.keys(res.data);
          keys.forEach(function(i) {
            $scope.mostSoldArticles.push({
              currency: i[0].toUpperCase() + i.slice(1, i.length),
              data: res.data[i].map(function(r) {
                return {
                  name: r.name,
                  quantity: numeral(r.quantity || 0).format('0,0'),
                  total: numeral(r.total || 0).format('0,0'),
                  avg: numeral(r.avg || 0).format('0,0')
                };
              })
            });
          });
        })
        .catch(function(err) {
          // @TODO handle error
          console.log(err);
        });

    }

    getMostSoldArticles({
      start: moment().subtract(3, 'days').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      limit: 40
    });


  }]);
