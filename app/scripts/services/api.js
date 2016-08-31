'use strict';

angular.module('hexsales-client')
    .service('Api', ['$http', function($http) {

        var apiUrl = 'http://localhost:3000/v1';

        this.getAllArticles = function() {
            return $http.get(apiUrl + '/articles');
        };

        this.searchArticles = function(params) {
            params.contains = true;
            return $http.post(apiUrl + '/articles/search', params);
        };

        this.getArticleBasics = function(params) {
            return $http.get(apiUrl + '/articles/' + encodeURIComponent(params.name));
        };

        this.getArticleSummary = function(params) {
            var url = apiUrl + '/articles/' + encodeURIComponent(params.name) + '/summaries?q=1';
            if (params.start) {
                url = url + '&start=' + params.start;
            }
            if (params.end) {
                url = url + '&end=' + params.end;
            }
            return $http.get(url);
        };

        this.getSummary = function(params) {
            var url = apiUrl + '/summaries?q=1';
            if (params.start) {
                url = url + '&start=' + params.start;
            }
            if (params.end) {
                url = url + '&end=' + params.end;
            }
            if(params.set) {
                url = url + '&set=' + encodeURIComponent(params.set);
            }
            if(params.rarity) {
                url = url + '&rarity=' + encodeURIComponent(params.rarity);
            }
            if(params.type) {
                url = url + '&type=' + encodeURIComponent(params.type);
            }
            return $http.get(url);
        };

        this.getArticleHistory = function(params) {
            var url = apiUrl + '/articles/' + encodeURIComponent(params.name) + '/histories?q=1';
            if (params.start) {
                url = url + '&start=' + params.start;
            }
            if (params.end) {
                url = url + '&end=' + params.end;
            }
            return $http.get(url);
        }

        this.getEconomyHistory = function(params) {
            var url = apiUrl + '/histories?q=1';
            if (params.start) {
                url = url + '&start=' + params.start;
            }
            if (params.end) {
                url = url + '&end=' + params.end;
            }
            return $http.get(url);
        }

        this.getMostSoldArticles = function(params) {
            var url = apiUrl + '/stats/mostsold?q=1';
            if (params.start) {
                url = url + '&start=' + params.start;
            }
            if (params.end) {
                url = url + '&end=' + params.end;
            }
            if (params.limit) {
                url = url + '&limit=' + params.limit;
            }
            return $http.get(url);
        }

        this.getPricelist = function() {
            var url = apiUrl + '/stats/pricelist';
            return $http.get(url);
        }

        this.getSets = function() {
            var url = apiUrl + '/sets';
            return $http.get(url);
        }

        this.findRealSetName = function(key) {
            switch (key) {
                case 'PvE 01 Universal Card Set': return 'Frostring Arena';
                case 'Set01 PvE Arena': return 'Set 01 Wheels of Fate';
                case 'Set01 Kickstarter': return 'Set 01 Kickstarter';
                case 'Set01 PvE Holiday': return 'Set 01 Christmas Holiday';
                case 'Set03 PvE Promo': return 'Set 03 Chests';
                case 'Set04 PvE Promo': return 'Set 04 Chests';
                default: return key;
            }
        }

        // this.getConversionRate = function(params) {
        //   return $http.get(apiUrl + '/articles/' + params.name + '/conversion');
        // };

    }]);
