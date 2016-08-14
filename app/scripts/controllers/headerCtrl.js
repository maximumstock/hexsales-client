'use strict';

angular.module('hexsales-client').controller('HeaderCtrl', ['$scope', '$location', 'Api', function($scope, $location, Api) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    Api.getSets()
        .then(function(res) {
            $scope.sets = res.data.map(function(e) {
                return {
                    key: e,
                    value: Api.findRealSetName(e)
                }
            });
        })
        .catch(function(err) {
            console.log(err);
            // @TODO error handling
        });

}]);
