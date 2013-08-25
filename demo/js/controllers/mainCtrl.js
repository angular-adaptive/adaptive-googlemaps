/*global googlemaps */
(function () {
'use strict';

/**
 * The main controller for the app. 
 */
googlemaps.controller('mainCtrl', function mainCtrl($scope, $rootScope) {
  $scope.map1 = {
    sensor: false,
    size: '500x300',
    zoom: 9,
    center: 'San Francisco International Airport',
    markers: ['San Francisco', 'San Jose'],
    maptype: 'terrain',
    mapevents: {redirect: false, loadmap: true},
    listen: true
  };

  $scope.map2 = {
    sensor: false,
    size: '500x300',
    zoom: 6,
    center: 'Pennsylvania',
    markers: ['New York', 'Philadalphia', 'Washington DC'],
    maptype: 'roadmap',
    mapevents: {redirect: true, loadmap: false},
    listen: true
  };

  $scope.map3 = {
    sensor: false,
    size: '500x300',
    zoom: 12,
    center: 'New York',
    maptype: 'hybrid',
    listen: false
  };
});

})();