// <reference path="../../../../typings/angular-protractor/angular-protractor.d.ts" />
// <reference path="../../../../typings/jasmine/jasmine.d.ts" />

describe('Fast Castle', function() {
    it('should render the page', function() {
      browser.get('http://localhost:8080/');
      expect(browser.getTitle()).toEqual('AoC Planner');
    });
});