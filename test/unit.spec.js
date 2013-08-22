describe('adaptive.googlemaps', function() {

  beforeEach(module('adaptive.googlemaps'));

  var rootscope;
  beforeEach(inject(function($rootScope) {
    rootScope = $rootScope;
  }));

  var elm, scope;

  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element(
      '<googlemaps class="google-maps" sensor="false" size="500x300" zoom="9" center="San Francisco International Airport" markers="[\'San Francisco\', \'San Jose\']" maptype="terrain" mapevents="{redirect: false, loadmap: true}"></googlemaps>'
    );

    scope = $rootScope;

    $compile(elm)(scope);
    scope.$digest();
  }));

  it('shold have background image', function(){
    expect(elm.css('background-image').match(/\/\/maps.googleapis.com\/maps\/api\/staticmap\?sensor=false\&size=500x300\&maptype=terrain\&center=San\%20Francisco\%20International\%20Airport\&zoom=9\&markers=San\%20Francisco\&markers=San\%20Jose/g).length).toBe(1);
  });

});