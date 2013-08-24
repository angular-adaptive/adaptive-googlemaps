/**
 * angular-adaptive-googlemaps v0.1.2
 * The MIT License
 * Copyright (c) 2013 Jan Antala
 */

(function (google) {
  'use strict';

  var adaptive = angular.module('adaptive.googlemaps', []);

  adaptive.controller('GoogleMapsCtrl', [ '$scope', '$element', '$attrs', '$parse', '$log', function ($scope, $element, $attrs, $parse, $log) {

    var STATIC_URL = '//maps.googleapis.com/maps/api/staticmap?';
    var mapLoaded = false;
    var that = this;

    /**
     * Private methods
     */

    var getLocation = function(center, success, error) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': center}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          success(results[0].geometry.location);
        }
        else {
          error('Geocode was not successful for the following reason: ' + status);
        }
      });
    };

    var addMarker = function(address, map) {
      getLocation(address, function(location){
        var marker = new google.maps.Marker({
          position: location,
          title: address,
          map: map,
          draggable: false,
          animation: google.maps.Animation.DROP
        });
      });
    };

    var getMapType = function(maptype, href) {
      switch (maptype) {
        case 'satellite':
          return href ? 'k' : google.maps.MapTypeId.SATELLITE;
        case 'terrain':
          return href ? 'p' : google.maps.MapTypeId.TERRAIN;
        case 'hybrid':
          return href ? 'h' : google.maps.MapTypeId.HYBRID;
        default: // 'roadmap'
          return href ? 'm' : google.maps.MapTypeId.ROADMAP;
      }
    };

    /**
     * Public methods
     */

    this.buildStaticMap = function buildStaticMap(MAP_EVENTS, attrs, markers) {
      var markerStrings;

      if (markers) {
        if (!angular.isArray(markers)) {
          markers = [markers];
        }
        markerStrings = markers;
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

      (function(MAP_EVENTS){
        var query = markers && markers.length ? markers[0] : '';
        var b = MAP_EVENTS.redirect && getLocation(
          $attrs.center,
          function(location){
            $scope.MAP_HREF = 'http://maps.apple.com/?ll=' + location.mb + ',' + location.nb + '&q=' + query + '&z=' + $attrs.zoom + '&t=' + getMapType($attrs.maptype, true);
            $scope.$apply();
          },
          function(error){
            $scope.MAP_HREF = 'http://maps.apple.com/?' + '&q=' + query + '&z=' + $attrs.zoom + '&t=' + getMapType($attrs.maptype, true);
            $scope.$apply();
          }
        );
      })(MAP_EVENTS);

      return STATIC_URL + params.reduce(function (a, b) {
        if (!a) {
          return b;
        }

        if (b !== undefined) {
          return a + '&' + b;
        }

        return a;
      }, '');
    };

    this.buildDynamicMap = function(MAP_EVENTS, $element, center, zoom, maptype, markers) {
      var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: (Number(zoom) || 6),
        mapTypeId: getMapType(maptype, false)
      };

      var map = new google.maps.Map($element[0], mapOptions);

      getLocation(
        center,
        function(location){
          map.setCenter(location);
          for (var i = 0; markers && i < markers.length; i++) {
            addMarker(markers[i], map);
          }
        },
        function(error){
          $log.error(error);
        }
      );
    };

    this.setStyle = function(style){
      $log.log(style);
      $scope.style = style;
    };

  }]);

  adaptive.directive('googlemaps', [ '$parse', function ($parse) {
    return {
      template: '<a ng-style="style" ng-href="{{MAP_HREF}}" target="_blank"></a>',
      replace: true,
      restrict: 'E',
      controller: 'GoogleMapsCtrl',
      scope: true,

      link: function postLink(scope, element, attrs, ctrl) {

        var ael = element;
        var markers = $parse(attrs.markers)(scope);
        var MAP_EVENTS = angular.extend({}, $parse(attrs.mapevents)(scope));

        if (!attrs.sensor) {
          throw new Error('The `sensor` attribute is required.');
        }

        if (!attrs.size) {
          throw new Error('The `size` attribute is required.');
        }

        if (!attrs.center) {
          throw new Error('The `center` attribute is required.');
        }

        var sizeBits = attrs.size.split('x');
        if (sizeBits.length !== 2) {
          throw new Error('Size must be specified as `wxh`.');
        }

        var staticAttributes = {
          'sensor': attrs.sensor,
          'size': attrs.size,
          'maptype': attrs.maptype,
          'center': attrs.center,
          'zoom': attrs.zoom,
          'markers': attrs.markers
        };
        var imgsrc = ctrl.buildStaticMap(MAP_EVENTS, staticAttributes, markers);

        ctrl.setStyle({
          'display': 'block',
          'cursor': 'pointer',
          'background-image': 'url(\'' + imgsrc + '\')',
          'background-repeat': 'no-repeat',
          '-webkit-background-size': 'cover',
          '-moz-background-size': 'cover',
          '-o-background-size': 'cover',
          '-ms-background-size': 'cover',
          'background-size': 'cover',
          'background-position': 'center center'
        });

        var mapLoaded = false;
        element.bind('click', function(event){
          if (MAP_EVENTS.loadmap && !mapLoaded) {
            event.preventDefault();
            mapLoaded = true;
            ael.removeAttr('href');
            ctrl.buildDynamicMap(MAP_EVENTS, ael, attrs.center, attrs.zoom, attrs.maptype, markers);
          }
          else if (!MAP_EVENTS.redirect && !mapLoaded) {
            event.preventDefault();
          }
          else if (!MAP_EVENTS.loadmap && mapLoaded) {
            event.preventDefault();
          }
        });
      }
    };
  }]);
}(google));