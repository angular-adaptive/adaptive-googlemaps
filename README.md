# adaptive-googlemaps v0.3.0 [![Build Status](https://travis-ci.org/angular-adaptive/adaptive-googlemaps.png?branch=master)](https://travis-ci.org/angular-adaptive/adaptive-googlemaps)

This module allows you to adapt googlemaps component for different occasions.
- static google map
- open map in a new tab / a native mobile application
- load dynamic google map


### Demo

Check out http://angular-adaptive.github.io/adaptive-googlemaps/demo/

# Requirements

- AngularJS v 1.0+
- Googlemaps script (only for dynamic google map)

# Usage

We use [bower](http://twitter.github.com/bower/) for dependency management. Add

    dependencies: {
        "angular-adaptive-googlemaps": "latest"
    }

To your `bower.json` file. Then run

    bower install

This will copy the angular-adaptive-googlemaps files into your `bower_components` folder, along with its dependencies. Load the script files in your application:

    <script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script type="text/javascript" src="bower_components/angular/angular.js"></script>
    <script type="text/javascript" src="bower_components/angular-adaptive-googlemaps/angular-adaptive-googlemaps.min.js"></script>

Add the **adaptive.googlemaps** module as a dependency to your application module:

    var myAppModule = angular.module('MyApp', ['adaptive.googlemaps']);

Add **googlemaps** element into your template

    <googlemaps class="google-maps" options="map1"></googlemaps>

### Directive attributes

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

#### Required:

- sensor: false // true, false
- size: '500x300' // width x height
- zoom: 6
- center: 'California'

#### Optional:

- markers: ['San Francisco', 'San Jose']
- maptype: 'roadmap' // roadmap, satellite, terrain, hybrid
- mapevents: {redirect: true, loadmap: false}
- listen: true // watch for attributes change

#### mapevents: { "redirect": false, "loadmap": true }
Loads dynamic google map.

<p align="center">
    <img src="http://maps.googleapis.com/maps/api/staticmap?sensor=false&size=500x300&maptype=terrain&center=San%20Francisco%20International%20Airport&zoom=9&markers=San%20Francisco&markers=San%20Jose" alt="Map"/>
</p>

#### { "redirect": true, "loadmap": false }
Opens google map in a new tab / a native mobile application.

<p align="center">
    <img src="http://maps.googleapis.com/maps/api/staticmap?sensor=false&size=500x300&maptype=roadmap&center=Pennsylvania&zoom=6&markers=New%20York&markers=Philadalphia&markers=Washington%20DC" alt="Map"/>
</p>

#### mapevents: no mapevents
Nothing happens.

<p align="center">
    <img src="http://maps.googleapis.com/maps/api/staticmap?sensor=false&size=500x300&maptype=hybrid&center=New%20York&zoom=12" alt="Map"/>
</p>


# Contributing

Contributions are welcome. Please make a pull request against canary branch and do not bump versions. Also include tests.

### Todo
- Let the device/browser decide what kinds of map events will be used. *Example: mobile device will open native maps application, browser with fast internet connection will auto load dynamic map...*

# Testing

More tests will be added...

We use karma and jshint to ensure the quality of the code. The easiest way to run these checks is to use grunt:

    npm install -g grunt-cli
    npm install
    bower install
    grunt

The karma task will try to open Chrome as a browser in which to run the tests. Make sure this is available or change the configuration in `test/test.config.js` 

# References

If you are looking just for static google maps you can use [angular-google-staticmaps](https://github.com/passy/angular-google-staticmaps) repository.

# License

The MIT License

Copyright (c) 2013 Jan Antala, https://github.com/janantala
