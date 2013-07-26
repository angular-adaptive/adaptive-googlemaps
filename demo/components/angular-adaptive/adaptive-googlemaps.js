/**
 * angular-adaptive-googlemaps v0.1.0
 * The MIT License
 * Copyright (c) 2013 Jan Antala
 */

(function (google) {
  'use strict';

  var adaptive = angular.module('adaptive.googlemaps', []);

  var loadMap = function($element, center, zoom) {
    var mapOptions = {
      center: new google.maps.LatLng(0, 0),
      zoom: (Number(zoom) || 8),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map($element[0], mapOptions);

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': center}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      }
      else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });

  };

  adaptive.controller('GoogleMapsCtrl', function () {
      var BASE_URL = '//maps.googleapis.com/maps/api/staticmap?';
      var STYLE_ATTRIBUTES = ['color', 'label', 'size'];

      this.makeMarkerStrings = function makeMarkerStrings(markers) {
        return markers.map(function (marker) {
          var str = Object.keys(marker).map(function (key) {
            if (STYLE_ATTRIBUTES.indexOf(key) > -1) {
              return key + ':' + marker[key] + '|';
            }
          }).join('');

          return str + marker.coords.join(',');
        });
      };

      this.buildSourceString = function buildSourceString(attrs, markers) {
        var markerStrings;

        if (markers) {
          if (!angular.isArray(markers)) {
            markers = [markers];
          }
          markerStrings = this.makeMarkerStrings(markers);
        }

        var params = Object.keys(attrs).map(function (attr) {
          if (attr === 'markers' && markerStrings) {
            return Object.keys(markerStrings).map(function (key) {
              return 'markers=' + encodeURIComponent(markerStrings[key]);
            }).join('&');
          }

          if (attr[0] !== '$' && attr !== 'alt') {
            return encodeURIComponent(attr) + '=' + encodeURIComponent(attrs[attr]);
          }
        });

        return BASE_URL + params.reduce(function (a, b) {
          if (!a) {
            return b;
          }

          if (b !== undefined) {
            return a + '&' + b;
          }

          return a;
        }, '');
      };
    });

    adaptive.directive('googlemaps', function ($parse) {
      return {
        template: '<img alt="Google Map">',
        replace: true,
        restrict: 'E',
        controller: 'GoogleMapsCtrl',
        scope: true,

        link: function postLink(scope, element, attrs, ctrl) {
          var el = element[0];
          var markers = $parse(attrs.markers)(scope);

          if (!attrs.sensor) {
            throw new Error('The `sensor` attribute is required.');
          }

          if (!attrs.size) {
            throw new Error('The `size` attribute is required.');
          }

          var sizeBits = attrs.size.split('x');
          if (sizeBits.length !== 2) {
            throw new Error('Size must be specified as `wxh`.');
          }

          el.width = parseInt(sizeBits[0], 10);
          el.height = parseInt(sizeBits[1], 10);
          el.src = ctrl.buildSourceString(attrs, markers);
        }
      };
    });
}(google));