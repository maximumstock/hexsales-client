'use strict';

var app = angular.module('hexsales-client', ['ngRoute', 'highcharts-ng']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'OverviewCtrl',
      templateUrl: 'app/views/overview.html'
    })
    .when('/articles/:name', {
      controller: 'ArticleCtrl',
      templateUrl: 'app/views/article.html'
    })
    .when('/sets/:name', {
      controller: '',
      templateUrl: 'app/views/set.html'
    })
    .when('/search/:term', {
      controller: 'SearchResultCtrl',
      templateUrl: 'app/views/search.html'
    })
    .when('/about', {
      templateUrl: 'app/views/about.html'
    })
    .otherwise({
      redirectTo: 'app/views/overview.html'
    });
}]);
