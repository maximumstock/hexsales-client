'use strict';

app.controller('HeaderCtrl', ['$scope', '$location', 'Api', function($scope, $location, Api) {
  $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
  };
}]);
