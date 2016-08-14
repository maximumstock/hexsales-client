'use strict';

angular.module('hexsales-client')
    .controller('DailyReportCtrl', ['$scope', 'NgTableParams', 'Api', function($scope, NgTableParams, Api) {

        $scope.tables = {
            platinum: {},
            gold: {}
        };

        function getMostSoldArticles(params) {

            Api.getMostSoldArticles(params)
                .then(function(res) {

                    $scope.mostSoldArticles = []; // plat, gold

                    var keys = Object.keys(res.data);
                    keys.forEach(function(currency) {
                        $scope.mostSoldArticles.push({
                            currency: currency[0].toUpperCase() + currency.slice(1, currency.length),
                            data: res.data[currency].map(function(r) {
                                console.log(r.set);
                                return {
                                    name: r.name,
                                    set: Api.findRealSetName(r.set),
                                    rarity: r.rarity,
                                    quantity: {
                                        numerical: r.quantity,
                                        string: numeral(r.quantity).format('0,0')
                                    },
                                    total: {
                                        numerical: r.total,
                                        string: numeral(r.total).format('0,0')
                                    },
                                    avg: {
                                        numerical: r.avg,
                                        string: numeral(r.avg).format('0,0')
                                    }
                                };
                            })
                        });

                        $scope.tables[currency].tableParams = new NgTableParams({
                            sorting: {
                                'quantity.numerical': 'desc'
                            }
                        }, {
                            dataset: $scope.mostSoldArticles[currency === 'platinum' ? 0 : 1].data
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
            limit: 100
        });


    }]);
