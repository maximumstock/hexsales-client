'use strict';

angular.module('hexsales-client', ['ngRoute', 'ngCookies', 'ngTable'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'DailyReportCtrl',
                templateUrl: 'app/views/dailyreport.html'
            })
            .when('/sets/:set*', {
                controller: 'SetCtrl',
                templateUrl: 'app/views/set.html'
            })
            .when('/favorites', {
                controller: 'FavoritesCtrl',
                templateUrl: 'app/views/favorites.html'
            })
            .when('/economy', {
                controller: 'EconomyCtrl',
                templateUrl: 'app/views/economy.html'
            })
            .when('/articles/:uuid*', {
                controller: 'ArticleCtrl',
                templateUrl: 'app/views/article.html'
            })
            .when('/search/:term*', {
                controller: 'SearchResultCtrl',
                templateUrl: 'app/views/search.html'
            })
            .when('/explorer', {
                controller: 'ExplorerCtrl',
                templateUrl: 'app/views/explorer.html'
            })
            .when('/about', {
                templateUrl: 'app/views/about.html'
            })
            .otherwise({
                redirectTo: 'app/views/overview.html'
            });
    }]);
