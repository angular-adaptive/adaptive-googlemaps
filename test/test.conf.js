basePath = '..';
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'components/angular/angular.js',
  'components/angular-mocks/angular-mocks.js',
  'https://maps.googleapis.com/maps/api/js?sensor=false',
  'src/adaptive-googlemaps.js',
  'test/*.spec.js'
];
singleRun = true;
browsers = [ 'Chrome' ];