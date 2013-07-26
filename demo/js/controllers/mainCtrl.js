/*global googlemaps */
(function () {
'use strict';

/**
 * The main controller for the app. 
 */
googlemaps.controller('mainCtrl', function mainCtrl($scope, $rootScope) {
  $scope.markers = [{
      color: 'blue',
      label: 'A',
      coords: [48, 18]
  }];
});

})();