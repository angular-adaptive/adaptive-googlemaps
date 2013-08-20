/**
 * angular-adaptive-googlemaps v0.1.0
 * The MIT License
 * Copyright (c) 2013 Jan Antala
 */

(function (google) {
  'use strict';

  var adaptive = angular.module('adaptive.googlemaps', []);

  adaptive.controller('GoogleMapsCtrl', function ($scope, $element, $attrs, $parse) {
      $scope.MAP_HREF = 'http://maps.apple.com/?ll=' + '' + '&q=' + $attrs.center + '&z=' + $attrs.zoom;
      var STATIC_URL = '//maps.googleapis.com/maps/api/staticmap?';
      var STYLE_ATTRIBUTES = ['color', 'label', 'size'];
      var that = this;

      this.makeMarkerStrings = function makeMarkerStrings(markers) {
        return markers.map(function (marker) {
          var str = marker;

          return str + marker;
        });
      };

      this.buildSourceString = function buildSourceString(attrs, markers) {
        console.log(markers);
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

        (function(){
          getLocation(
            $attrs.center,
            function(location){
              $scope.MAP_HREF = 'http://maps.apple.com/?ll=' + location.mb + ',' + location.nb + '&q=' + markers[0] + '&z=' + $attrs.zoom;
              $scope.$apply();
            },
            function(error){
            }
          );
        })();

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

      var mapLoaded = false;
      this.loadMap = function($element, center, zoom, markers) {
        console.log('loadmap');
        var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: (Number(zoom) || 8),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map($element[0], mapOptions);
        $scope.MAP_HREF = '';
        $element[0].href='';

        getLocation(
          center,
          function(location){
            map.setCenter(location);
            for (var i = 0; i < markers.length; i++) {
              addMarker(markers[i], map);
            }
          },
          function(error){
            console.error(error);
          }
        );
      };

      this.setStyle = function(style){
        console.log(style);
        $scope.style = style;
      };

    });

    adaptive.directive('googlemaps', function ($parse) {
      return {
        template: '<a ng-style="style" ng-href="{{MAP_HREF}}" target="_blank"><img alt="Google Map" ></a>',
        replace: true,
        restrict: 'E',
        controller: 'GoogleMapsCtrl',
        scope: true,

        link: function postLink(scope, element, attrs, ctrl) {

          var REDIRECT_ON_CLICK = true;
          var LOAD_MAP_ON_CLICK = true;
          var ael = element;
          var imgel = element.find('img')[0];

          var markers = $parse(attrs.markers)(scope);

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
            'center': attrs.center,
            'zoom': attrs.zoom,
            'markers': attrs.markers
          };
          imgel.src = ctrl.buildSourceString(staticAttributes, markers);
          console.log(imgel);


          ctrl.setStyle({
            'display': 'block',
            'cursor': 'pointer',
            'width': parseInt(sizeBits[0], 10) + 'px',
            'height': parseInt(sizeBits[1], 10) + 'px'
          });

          var mapLoaded = false;
          element.bind('click', function(event){
            if (LOAD_MAP_ON_CLICK && !mapLoaded) {
              event.preventDefault();
              mapLoaded = true;
              ctrl.loadMap(ael, attrs.center, attrs.zoom, markers);
            }
            else if (!REDIRECT_ON_CLICK && !mapLoaded) {
              event.preventDefault();
            }
            else if (!LOAD_MAP_ON_CLICK && mapLoaded) {
              event.preventDefault();
            }
          });
        }
      };
    });
}(google));