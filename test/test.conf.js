module.exports = function(config) {
  config.set({
    basePath: '..',
    files: [
      'components/angular/angular.js',
      'components/angular-mocks/angular-mocks.js',
      'https://maps.googleapis.com/maps/api/js?sensor=false',
      'src/adaptive-googlemaps.js',
      'test/*.spec.js'
    ],
    frameworks: ['jasmine'],
    singleRun: true,
    browsers: [ 'Chrome' ]
  });
};