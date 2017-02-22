'use strict';

angular.module('hexsales-client').controller('ExplorerCtrl', ['$scope', 'Api', function($scope, Api) {

			$scope.params = {
				start: moment().subtract(1, 'month').format('YYYY-MM-DD'),
				end: moment().format('YYYY-MM-DD'),
				set: 'Herofall',
				type: 'Card',
				rarity: 'Legendary'
			}

			$scope.types = [{
				name: 'Any Type',
				value: '%'
			}].concat(articleTypes.map(function(e) {return {name: e, value: e}; }));
			$scope.rarities = [{
				name: 'Any Rarity',
				value: '%'
			}].concat(gameRarities.map(function(e) {
				return {
					name: e,
					value: e
				};
			}));
			Api.getSets()
				.then(function(res) {
					$scope.sets = [{
						name: 'Any Set',
						value: '%'
					}].concat(res.data.map(function(e) {
						return {
							name: Api.findRealSetName(e),
							value: e
						}
					}));
				})
				.catch(function(err) {
					throw err;
				});

			$scope.getData = function(params) {
				Api.getHistory(params)
					.then(function(res) {
						buildHistoryChart(res.data);
					})
					.catch(function(err) {
						throw err;
					});
			}

			$scope.getData($scope.params)


			function buildHistoryChart(data) {

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

				var chartConfigs = {
          platinum: JSON.parse(JSON.stringify(chartConfig)),
          gold: JSON.parse(JSON.stringify(chartConfig))
        };

				['platinum', 'gold'].forEach(function(cur) {

            var containerName = '#explorer-history-' + cur.toLowerCase();

						// if there is no data for a specific currency, stop trying to draw a graph
						if (data.length === 0) {
							$(containerName).remove();
							return;
						}

						// configure y axises labeling
						var config = chartConfigs[cur];
						config.yAxis[0].labels.format = "{value} " + cur[0].toUpperCase();
						config.yAxis[0].title.text = cur[0].toUpperCase() + cur.slice(1, cur.length);

						config.yAxis[1].labels.format = "{value} Units";
						config.yAxis[1].title.text = "Quantity";

						// customize chart title
						config.title.text = 'History for ' + cur[0].toUpperCase() + cur.slice(1, cur.length);

						// customize selected zoom stage of x-axis
						// depending on the date string of the most recent string, it is needed to zoom out of the 3 month window,
						// which is the default in `chartConfig`. we have to do that to make sure that the most recent date is
						// displayed in the graph
						if (data[cur].length > 0) {
							var monthDiff = moment().diff(moment(data[cur][0].d), 'months');
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
							minmax = [],
              total = [],
              cumulativeQuantity = [],
              cumulativeTotal = [];

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

            var totalSeries = {
                name: "Total",
                data: total,
                line: 'line',
                lineWidth: 2,
                color: "#23b1b1",
                index: 2,
                tooltip: {
                    valueSuffix: " " + cur[0].toUpperCase()
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
              visible: false,
							color: "#000",
							index: 3,
							tooltip: {
								valueSuffix: " " + cur[0].toUpperCase()
							}
						};

						var minMaxSeries = {
							name: "Min/Max",
							type: "arearange",
              visible: false,
							index: 4,
							color: '#ff7700', //'#ff7700',
							data: minmax,
							tooltip: {
								valueSuffix: " " + cur[0].toUpperCase()
							}
						};

            var cumulativeQuantitySeries = {
                name: "Cumulative Quantity",
                type: "area",
                color: "#007777",
                index: 5,
                data: cumulativeQuantity,
                visible: false,
                yAxis: 1,
                tooltip: {
                    valueSuffix: " Units"
                }
            };

            var cumulativeTotalSeries = {
                name: "Cumulative Total",
                type: "area",
                // color: "#007777",
                index: 6,
                data: cumulativeTotal,
                visible: false,
                yAxis: 0,
                tooltip: {
                    valueSuffix: " " + cur[0].toUpperCase()
                }
            };

            var cumulativeQuantityAcc = 0;
            var cumulativeTotalAcc = 0;

						data[cur].forEach(function(i) {

							var d = Date.parse(i.d);
							minmax.push([d, i.mi, i.ma]);
							avg.push([d, i.a]);
              total.push([d, i.t]);
							quantity.push([d, i.q]);
              cumulativeQuantityAcc = cumulativeQuantityAcc + i.q;
              cumulativeQuantitySeries.data.push([d, cumulativeQuantityAcc]);
              cumulativeTotalAcc = cumulativeTotalAcc + i.t;
              cumulativeTotalSeries.data.push([d, cumulativeTotalAcc]);

						});

						config.series = [quantitySeries, totalSeries, avgSeries, minMaxSeries, cumulativeTotalSeries, cumulativeQuantitySeries, getFlagSeries()];
						// add chart to DOM
						$(containerName).highcharts('StockChart', config);
					});

				}

			}]);
