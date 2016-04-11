'use strict';

var app = angular.module('hexsales-client', ['ngRoute', 'highcharts-ng']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'EconomyCtrl',
      templateUrl: 'app/views/economy.html'
    })
    .when('/articles', {
      controller: 'ArticleCtrl',
      templateUrl: 'app/views/articles.html'
    })
    .when('/articles/:name', {
      controller: 'SingleArticleCtrl',
      templateUrl: 'app/views/article.html'
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
