'use strict';

app.controller('SingleArticleCtrl', ['$scope', '$location', '$routeParams', 'Api', function($scope, $location, $routeParams, Api) {

  $scope.articleName = $routeParams.name;
  $scope.articleNameSanitized = $scope.articleName;
  // pre-init
  $scope.summaryData = {};
  $scope.historyData = {};
  $scope.chartConfigs = {
    platinum: {},
    gold: {}
  };

  var specialCharacters = [' ', ',', '\'', '-'];
  specialCharacters.forEach(function(sc) {
    $scope.articleNameSanitized = $scope.articleNameSanitized.split(sc).join('');
  });

  // try to find the specified article
  // if the specified article does not seem to exist, redirect to main page
  // if the specified article does exist, load further data and render the page
  Api.getArticleBasics({name: $scope.articleName})
    .then(function(res) {
      getArticleBasics();
      getHistories();
    })
    .catch(function(err) {
      $location.path('/');
    });


  // helper function to load basic article information based on it's name
  function getArticleBasics() {
    Api.getArticleBasics({
        name: $scope.articleName
      })
      .then(function(res) {
        $scope.articleBasics = res.data;
        getSummaries();
      })
      .catch(function(err) {
        throw err;
      });
  }


  // helper function to load summary data
  function getSummaries() {

    // assign helper method to scope so it can be used in templates
    $scope.isNumber = angular.isNumber;

    var timeframes = [3, 7, 14, 21, 30, 60]; // find summaries for last {x} days
    if($scope.articleBasics.type !== 'Pack') {
      timeframes.push('Lifetime');
    }
    timeframes.forEach(function(timeframe) {

      var params = {
        start: moment().subtract(timeframe, 'days').format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),
        name: $scope.articleName
      };

      if (timeframe === 'Lifetime') {
        params.start = '2014-12-01';
      }

      Api.getArticleSummary(params)
        .then(function(res) {
          Object.keys(res.data).forEach(function(cur) {
            Object.keys(res.data[cur]).forEach(function(p) {
              res.data[cur][p] = numeral(res.data[cur][p] || 0).format('0,0');
            })
          })
          $scope.summaryData[timeframe] = res.data;
        })
        .catch(function(err) {
          throw err;
        });

    });

  }


  // helper function to load history data
  function getHistories() {

    var params = {
      name: $scope.articleName,
      start: '2014-12-01',
      end: moment().format('YYYY-MM-DD')
    };

    Api.getArticleHistory(params)
      .then(function(res) {
        $scope.historyData.raw = res.data;

        var chartConfig = {
          options: {
            rangeSelector: {
              selected: 1,
              enabled: true
            },
            navigator: {
              enabled: true
            },
            xAxis: {
              type: "datetime"
            },
            chart: {
              zoomType: 'x'
            },
            lang: {
              decimalPoint: '.',
              thousandsSep: ','
            },
            legend: {
              enabled: true,
              align: "center",
              symbolWidth: 30,
              itemStyle: {
                cursor: 'pointer',
                fontSize: '12px'
              }
            },
            tooltip: {
              useHTML: true,
              crosshairs: [{
                width: 1,
                color: 'grey'
              }, {
                width: 1,
                color: 'grey'
              }],
              shared: true,
              valueDecimals: 0
            }
          },
          subtitle: {
            text: "You can select/deselect single graph elements by clicking on their legend entry."
          },
          title: {
            useHTML: true
          },
          yAxis: [{ // Primary yAxis
            labels: {
              x: -2,
              align: "right"
            },
            title: {},
            opposite: true,
            showEmpty: false,
            min: 0
          }, { // Secondary yAxis
            labels: {
              align: 'left',
              x: 2
            },
            title: {},
            gridLineWidth: 0,
            opposite: false,
            showEmpty: false,
            min: 0
          }],
          series: [],
          useHighStocks: true,
          size: {
            height: 500
          }
        };

        $scope.chartConfigs.platinum = JSON.parse(JSON.stringify(chartConfig));
        $scope.chartConfigs.gold = JSON.parse(JSON.stringify(chartConfig));

        ['platinum', 'gold'].forEach(function(cur) {

          // configure y axises labeling
          var config = $scope.chartConfigs[cur];
          config.yAxis[0].labels.format = "{value} " + cur[0].toUpperCase();
          config.yAxis[0].title.text = cur[0].toUpperCase() + cur.slice(1, cur.length);

          config.yAxis[1].labels.format = "{value} Units";
          config.yAxis[1].title.text = "Quantity";

          // customize chart title
          config.title.text = 'History for <b>' + $scope.articleName + '</b> - ' + cur[0].toUpperCase() + cur.slice(1, cur.length);

          // start parsing series data
          var min = [],
            max = [],
            avg = [],
            median = [],
            quantity = [],
            minmax = [];

          var quantitySeries = {
            name: "Quantity",
            type: "column",
            data: quantity,
            color: '#eaeaea',
            index: 1,
            yAxis: 1,
            tooltip: {
              valueSuffix: " Units"
            }
          };

          var avgSeries = {
            name: "Average",
            type: "line",
            data: avg,
            lineWidth: 2,
            color: "#000",
            index: 3,
            tooltip: {
              valueSuffix: " " + cur[0].toUpperCase()
            }
          };

          var medianSeries = {
            name: "Median",
            type: "line",
            lineWidth: 3,
            data: median,
            color: "#23b1b1",
            visible: false,
            index: 4,
            tooltip: {
              valueSuffix: " " + cur[0].toUpperCase()
            }
          };

          var minMaxSeries = {
            name: "Min/Max",
            type: "arearange",
            index: 2,
            color: '#ff7700', //'#ff7700',
            data: minmax,
            tooltip: {
              valueSuffix: " " + cur[0].toUpperCase()
            }
          };

          $scope.historyData.raw[cur].forEach(function(i) {

            var d = Date.parse(i.d);

            minmax.push([d, i.mi, i.ma]);
            avg.push([d, i.a]);
            median.push([d, i.me]);
            quantity.push([d, i.q]);

          });
          config.series = [quantitySeries, avgSeries, medianSeries, minMaxSeries, chartFlagSeries];
        });

      })
      .catch(function(err) {
        throw err;
      });

  }




  // // helper function to load conversion rate data
  // function getConversionRate() {
  //
  //   Api.getConversionRate({name: $scope.articleName})
  //     .then(function(res) {
  //       console.log(res.data);
  //     })
  //     .catch(function(err) {
  //       throw err;
  //     });
  //
  // }




}]);
