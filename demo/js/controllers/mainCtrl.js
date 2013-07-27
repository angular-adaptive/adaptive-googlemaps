/*global googlemaps */
(function () {
'use strict';

/**
 * The main controller for the app. 
 */
googlemaps.controller('mainCtrl', function mainCtrl($scope, $rootScope) {
  $scope.markers = [{
      color: 'FE7569', // need to be hexa
      label: 'Z',
      title: 'mytitle',
      coords: [48, 18]
  }];
});

})();