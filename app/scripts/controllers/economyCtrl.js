'use strict';

app.controller('EconomyCtrl', ['$scope', 'Api', function($scope, Api) {

  var params = {
    start: '2014-01-01', //moment().subtract(3, 'months').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD')
  };

  getEconomyHistory(params);


  // helper function that loads and builds a history chart
  function getEconomyHistory(params) {
    Api.getEconomyHistory(params)
      .then(function(res) {
        $scope.economyData = res.data;

        buildRegularHistoryChart($scope.economyData);
        buildAreaHistoryChart($scope.economyData);

      })
      .catch(function(err) {
        throw err;
      });
  }


  // helper function to build percentage area history charts
  function buildAreaHistoryChart(data) {

    var chartConfig = {
      plotOptions: {
        area: {
          stacking: 'percent',
          lineColor: '#ffffff',
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: '#ffffff'
          }
        }
      },
      rangeSelector: {
        enabled: true
      },
      navigator: {
        enabled: true
      },
      xAxis: {
        type: "datetime"
      },
      chart: {
        zoomType: 'x',
        type: 'area'
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
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} Units)<br/>',
        shared: true,
        valueDecimals: 0
      },
      subtitle: {
        text: "You can select/deselect single graph elements by clicking on their legend entry."
      },
      title: {
        useHTML: true
      },
      yAxis: {
        labels: {
          x: -2,
          align: "right"
        },
        title: {
          text: ''
        },
        opposite: false
      },
      series: [{
        name: 'Common',
        data: []
      }, {
        name: 'Uncommon',
        data: []
      }, {
        name: 'Rare',
        data: []
      }, {
        name: 'Legendary',
        data: []
      }, {
        name: 'Epic',
        data: []
      }],
      useHighStocks: true

    };


    ['platinum', 'gold'].forEach(function(cur) {

      // configure y axises labeling
      var config = JSON.parse(JSON.stringify(chartConfig));
      config.yAxis.labels.format = "{value} %";
      config.yAxis.title.text = 'Percent';

      // customize chart title
      config.title.text = 'Sold Units by Rarity and Day - ' + cur[0].toUpperCase() + cur.slice(1, cur.length);

      var t = {
        'common': 0,
        'uncommon': 1,
        'rare': 2,
        'legendary': 3,
        'epic': 4
      };
      data[cur].forEach(function(i) {

        // skip entries without rarity
        if (!i.r || i.r === '') {
          return;
        }

        var d = Date.parse(i.d);

        config.series[t[i.r.toLowerCase()]].data.push([d, i.q]);

      });
      config.series.push(chartFlagSeries);

      // add chart to DOM
      $('#economy-area-' + cur.toLowerCase()).highcharts(config);
    });

  }

  // helper function to build regular history charts
  function buildRegularHistoryChart(data) {

    var chartConfig = {
      rangeSelector: {
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
          x: 2,
          y: -2
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

    ['platinum', 'gold'].forEach(function(cur) {

      // configure y axises labeling
      var config = JSON.parse(JSON.stringify(chartConfig));
      config.yAxis[0].labels.format = "{value} " + cur[0].toUpperCase();
      config.yAxis[0].title.text = cur[0].toUpperCase() + cur.slice(1, cur.length);

      config.yAxis[1].labels.format = "{value} Units";
      config.yAxis[1].title.text = "Quantity";

      // customize chart title
      config.title.text = 'Global Economy History - ' + cur[0].toUpperCase() + cur.slice(1, cur.length);

      // start parsing series data
      var total = [],
        quantity = [],
        cumulativeQuantity = [],
        cumulativeTotal = [];

      var quantitySeries = {
        name: "Quantity",
        type: 'column',
        data: quantity,
        color: '#23b1b1',
        index: 2,
        yAxis: 1,
        tooltip: {
          valueSuffix: " Units"
        }
      };

      var totalSeries = {
        name: "Total",
        type: "line",
        data: total,
        lineWidth: 2,
        color: "#000",
        index: 3,
        tooltip: {
          valueSuffix: " " + cur[0].toUpperCase()
        }
      };

      var cumulativeQuantitySeries = {
        name: "Cumulative Quantity",
        type: "area",
        color: "#007777",
        index: 0,
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
        index: 1,
        data: cumulativeTotal,
        visible: false,
        yAxis: 0,
        tooltip: {
          valueSuffix: " " + cur[0].toUpperCase()
        }
      };

      var currentDate = null;
      var qAcc = 0; // daily quantity acc variable
      var tAcc = 0; // daily total acc variable
      var cumulativeQuantityAcc = 0;
      var cumulativeTotalAcc = 0;

      data[cur].forEach(function(i) {

        var d = Date.parse(i.d);

        // if we hit a new date, push old data
        if(currentDate !== d) {
          quantity.push([d, qAcc]);
          qAcc = 0;
          total.push([d, tAcc]);
          tAcc = 0;
          cumulativeQuantity.push([d, cumulativeQuantityAcc]);
          cumulativeTotal.push([d, cumulativeTotalAcc]);

          currentDate = d;
        } else {
          // if it is the same date as before, just sum up the values
          qAcc = qAcc + i.q;
          tAcc = tAcc + i.t;
          cumulativeQuantityAcc = cumulativeQuantityAcc + i.q;
          cumulativeTotalAcc = cumulativeTotalAcc + i.t;
        }

      });
      config.series = [quantitySeries, totalSeries, cumulativeQuantitySeries, cumulativeTotalSeries, chartFlagSeries];
      $('#economy-regular-' + cur.toLowerCase()).highcharts(config);
    });

  }

}]);
