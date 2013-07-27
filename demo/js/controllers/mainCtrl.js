/*global googlemaps */
(function () {
'use strict';

/**
 * The main controller for the app. 
 */
googlemaps.controller('mainCtrl', function mainCtrl($scope, $rootScope) {
  $scope.markers = [{
      color: 'blue',
      label: 'Z',
      title: 'mytitle',
      coords: [48, 18]
  },
  {
      color: 'yellow',
      label: 'A',
      title: 'mytitle',
      coords: [49, 18]
  }];
});

})();