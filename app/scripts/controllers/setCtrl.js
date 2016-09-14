'use strict';

angular.module('hexsales-client').controller('SetCtrl', ['$scope', '$location', '$routeParams', 'NgTableParams', 'Api', function($scope, $location, $routeParams, NgTableParams, Api) {

    $scope.setName = $routeParams.set;
    $scope.realSetName = Api.findRealSetName($scope.setName);
    // pre-init
    $scope.articles = [];
    $scope.summaryByRarityData = [];
    $scope.summaryData = {};
    $scope.historyData = {};
    $scope.chartConfigs = {
        platinum: {},
        gold: {}
    };

    getArticles();

    // helper function to find all articles for the current set
    function getArticles() {
        var params = {
            set: $scope.setName,
            limit: 1000
        };

        Api.searchArticles(params)
            .then(function(res) {
                $scope.articles = res.data;
                if($scope.articles.length === 0) {
                    return $location.path('/about');
                }
                getSummaries();
                // getSummariesByRarity();
                $scope.articlesTable = new NgTableParams({
                  sorting: {
                    'name': 'asc'
                  }
                }, {
                  dataset: $scope.articles
                });
            })
            .catch(function(error) {
                console.log(error);
                // @TODO error handling
            })
    }

    // helper function to load summary data by rarity
    function getSummariesByRarity() {

        var timeframes = [1, 3, 5, 7];
        timeframes.forEach(function(timeframe) {

            gameRarities.forEach(function(rarity) {
           
                var params = {
                    start: moment().subtract(timeframe, 'days').format('YYYY-MM-DD'),
                    end: moment().format('YYYY-MM-DD'),
                    set: $scope.setName,
                    rarity: rarity
                };
          
                Api.getSummary(params)
                    .then(function(res) {
                        $scope.summaryByRarityData.push({
                            rarity: rarity,
                            rarityNumeric: Api.mapRarityToInt(rarity), 
                            timeframe: timeframe,
                            data: Api.formatAllDemNumbers(res.data)
                        });
                        $scope.summaryByRarityData.sort(function(a, b) {
                            if(a.rarityNumeric < b.rarityNumeric) return -1;
                            if(a.rarityNumeric > b.rarityNumeric) return 1;
                            return 0;
                        });
                    })
                    .catch(function(err) {
                        console.log(err);
                    });


            }); 

        });

    }

    // helper function to load summary data
    function getSummaries() {

        // assign helper method to scope so it can be used in templates
        $scope.isNumber = angular.isNumber;

        var timeframes = [1, 2, 3, 6, 7, 8, 13, 14, 15]; // find summaries for last {x} days
        timeframes.forEach(function(timeframe) {

            var params = {
                start: moment().subtract(timeframe, 'days').format('YYYY-MM-DD'),
                end: moment().format('YYYY-MM-DD'),
                set: $scope.setName
            };

            Api.getSummary(params)
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

}]);
