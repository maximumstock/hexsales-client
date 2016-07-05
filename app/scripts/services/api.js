'use strict';

angular.module('hexsales-client')
  .service('Api', ['$http', function($http) {

    var apiUrl = 'http://localhost:3000/v1';

    this.searchArticles = function(params) {
      params.contains = true;
      return $http.post(apiUrl + '/articles/search', params);
    };

    this.getArticleBasics = function(params) {
      return $http.get(apiUrl + '/articles/' + encodeURIComponent(params.name));
    };

    this.getArticleSummary = function(params) {
      var url = apiUrl + '/articles/' + encodeURIComponent(params.name) + '/summaries?q=1';
      if(params.start) {
        url = url + '&start=' + params.start;
      }
      if(params.end) {
        url = url + '&end=' +  params.end;
      }
      return $http.get(url);
    };

    this.getArticleHistory = function(params) {
      var url = apiUrl + '/articles/' + encodeURIComponent(params.name) + '/histories?q=1';
      if(params.start) {
        url = url + '&start=' +  params.start;
      }
      if(params.end) {
        url = url + '&end=' + params.end;
      }
      return $http.get(url);
    }

    this.getEconomyHistory = function(params) {
      var url = apiUrl + '/economy/histories?q=1';
      if(params.start) {
        url = url + '&start=' +  params.start;
      }
      if(params.end) {
        url = url + '&end=' + params.end;
      }
      return $http.get(url);
    }

    this.getMostSoldArticles = function(params) {
      var url = apiUrl + '/economy/mostsold?q=1';
      if(params.start) {
        url = url + '&start=' +  params.start;
      }
      if(params.end) {
        url = url + '&end=' + params.end;
      }
      if(params.limit) {
        url = url + '&limit=' + params.limit;
      }
      return $http.get(url);
    }

    // this.getConversionRate = function(params) {
    //   return $http.get(apiUrl + '/articles/' + params.name + '/conversion');
    // };

  }]);
