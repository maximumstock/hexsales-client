'use strict';

angular.module('hexsales-client')
  .service('Api', ['$http', function($http) {

    var apiUrl = 'http://localhost:3000/v1';

    this.findArticle = function(articleName) {
      return $http.get(apiUrl + '/articles/' + articleName)
    };

    this.searchArticles = function(params) {
      return $http.post(apiUrl + '/articles/search', params);
    };

    this.getArticleBasics = function(params) {
      return $http.get(apiUrl + '/articles/' + params.name);
    };

    this.getArticleSummary = function(params) {
      var url = apiUrl + '/articles/' + params.name + '/summaries?q=1';
      if(params.start) {
        url = url + '&start=' + params.start;
      }
      if(params.end) {
        url = url + '&end=' +  params.end;
      }
      return $http.get(url);
    };

    this.getArticleHistory = function(params) {
      var url = apiUrl + '/articles/' + params.name + '/histories?q=1';
      if(params.start) {
        url = url + '&start=' +  params.start;
      }
      if(params.end) {
        url = url + '&end=' + params.end;
      }
      return $http.get(url);
    }

    // this.getConversionRate = function(params) {
    //   return $http.get(apiUrl + '/articles/' + params.name + '/conversion');
    // };

  }]);
