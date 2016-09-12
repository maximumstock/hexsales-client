'use strict';

angular.module('hexsales-client').controller('ArticleCtrl', ['$scope', '$location', '$routeParams', 'Api', function($scope, $location, $routeParams, Api) {

    $scope.articleUUID = $routeParams.uuid;

    // in case someone uses the uuid parameter like before and enters an actual name and not a uuid,
    // we should catch that and redirect to the search page
    var isUUID = $routeParams.uuid.match(/([a-z0-9])+(-[a-z0-9]*){4}/) ? true : false;
    if(!isUUID) {
        return $location.path('/search/' + $routeParams.uuid);
    }



    // pre-init
    $scope.summaryData = {};
    $scope.historyData = {};
    $scope.chartConfigs = {
        platinum: {},
        gold: {}
    };

    // try to find the specified article
    // if the specified article does not seem to exist, redirect to main page
    // if the specified article does exist, load further data and render the page
    Api.getArticleBasics($scope.articleUUID)
        .then(function(res) {
            $scope.articleBasics = res.data;
            getSummaries();
            getHistories();
        })
        .catch(function(err) {
            $location.path('/');
        });


    // helper function to load summary data
    function getSummaries() {

        // assign helper method to scope so it can be used in templates
        $scope.isNumber = angular.isNumber;

        var timeframes = [3, 7, 14, 21, 30, 60]; // find summaries for last {x} days
        if ($scope.articleBasics.type !== 'Pack') {
            timeframes.push('Lifetime');
        }
        timeframes.forEach(function(timeframe) {

            var params = {
                start: moment().subtract(timeframe, 'days').format('YYYY-MM-DD'),
                end: moment().format('YYYY-MM-DD'),
                uuid: $scope.articleUUID
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
            uuid: $scope.articleUUID,
            start: '2014-12-23',
            end: moment().format('YYYY-MM-DD')
        };

        Api.getArticleHistory(params)
            .then(function(res) {
                $scope.historyData.raw = res.data;

                var chartConfig = {
                    rangeSelector: {
                        enabled: true,
                        selected: 1
                    },
                    xAxis: {
                        type: "datetime"
                    },
                    chart: {
                        zoomType: 'x'
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
                            y: -2,
                            align: "right"
                        },
                        title: {},
                        opposite: true,
                        showEmpty: false,
                        min: 0
                    }, { // Secondary yAxis
                        labels: {
                            align: 'left',
                            y: -2,
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

                    // if there is no data for a specific currency, stop trying to draw a graph
                    if($scope.historyData.raw[cur].length === 0) {
                        $('#article-history-' + cur.toLowerCase()).remove();
                        return;
                    }

                    // configure y axises labeling
                    var config = $scope.chartConfigs[cur];
                    config.yAxis[0].labels.format = "{value} " + cur[0].toUpperCase();
                    config.yAxis[0].title.text = cur[0].toUpperCase() + cur.slice(1, cur.length);

                    config.yAxis[1].labels.format = "{value} Units";
                    config.yAxis[1].title.text = "Quantity";

                    // customize chart title
                    config.title.text = 'History for <b>' + $scope.articleBasics.name + '</b> - ' + cur[0].toUpperCase() + cur.slice(1, cur.length);

                    // customize selected zoom stage of x-axis
                    // depending on the date string of the most recent string, it is needed to zoom out of the 3 month window,
                    // which is the default in `chartConfig`. we have to do that to make sure that the most recent date is
                    // displayed in the graph
                    if ($scope.historyData.raw[cur].length > 0) {
                        var monthDiff = moment().diff(moment($scope.historyData.raw[cur][$scope.historyData.raw[cur].length - 1].d), 'months');
                        if (monthDiff >= 12) {
                            // just give up, set the chart time window to display all sales
                            config.rangeSelector.selected = 5;
                        }
                        if (monthDiff < 12) {
                            // set time window to last year
                            config.rangeSelector.selected = 4;
                        }
                        if (monthDiff < 6) {
                            // set time window to last 6 months
                            config.rangeSelector.selected = 2;
                        }
                        if (monthDiff < 3) {
                            // we gucci, since the latest data is within the default window of 3 months
                            config.rangeSelector.selected = 1;
                        }
                    }

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
                        name: "Mean",
                        type: "line",
                        data: avg,
                        marker: {
                            enabled: true,
                            radius: 3
                        },
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
                        marker: {
                            enabled: true,
                            radius: 3
                        },
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
                        median.push([d, i.m]);
                        quantity.push([d, i.q]);

                    });

                    config.series = [quantitySeries, avgSeries, medianSeries, minMaxSeries, getFlagSeries()];
                    // add chart to DOM
                    $('#article-history-' + cur.toLowerCase()).highcharts('StockChart', config);

                });


            })
            .catch(function(err) {
                throw err;
            });

    }


}]);
