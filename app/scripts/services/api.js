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

        this.getArticleBasics = function(uuid) {
            return $http.get(apiUrl + '/articles/' + encodeURIComponent(uuid));
        };

        this.getArticleSummary = function(params) {
            var url = apiUrl + '/articles/' + encodeURIComponent(params.uuid) + '/summaries?q=1';
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
            var url = apiUrl + '/articles/' + encodeURIComponent(params.uuid) + '/histories?q=1';
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

        this.mapRarityToInt = function(string) {
            switch(string.toLowerCase()) {
                case 'common': return 0;
                case 'uncommon': return 1;
                case 'rare': return 2;
                case 'legendary': return 3;
                case 'epic': return 4;
                case 'promo': return 4;
                default: return string; 
            }
        }

        this.formatAllDemNumbers = function(o) {

            var self = this;

            if(!o) return o;
            if(typeof o === 'object' && Array.isArray(o) === false) {
                var keys = Object.keys(o);
                keys.forEach(function(k) {
                    o[k] = self.formatAllDemNumbers(o[k]);
                });
                return o;
            }
            if(Array.isArray(o)) {
                for(var i = 0; i < o.length; i++) {
                    o[i] = self.formatAllDemNumbers(o[i]);
                }
                return o;
            }
            if(typeof o === 'number') {
                return numeral(o).format('0,0');
            }

        }

        // this.getConversionRate = function(params) {
        //   return $http.get(apiUrl + '/articles/' + params.name + '/conversion');
        // };

    }]);
