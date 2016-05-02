'use strict';

angular.module('hexsales-client').controller('HeaderCtrl', ['$scope', '$location', 'Api', function($scope, $location, Api) {
  $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
  };
}]);
