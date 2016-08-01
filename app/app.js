'use strict';

angular.module('hexsales-client', ['ngRoute', 'ngCookies', 'ngTable'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'DailyReportCtrl',
        templateUrl: 'app/views/dailyreport.html'
      })
      .when('/favorites', {
        controller: 'FavoritesCtrl',
        templateUrl: 'app/views/favorites.html'
      })
      .when('/economy', {
        controller: 'EconomyCtrl',
        templateUrl: 'app/views/economy.html'
      })
      .when('/articles/:name*', {
        controller: 'SingleArticleCtrl',
        templateUrl: 'app/views/article.html'
      })
      .when('/search/:term*', {
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
