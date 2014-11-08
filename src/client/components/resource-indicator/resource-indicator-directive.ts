/// <reference path="../../../../typings/angularjs/angular.d.ts" />

function createResourceIndicatorDirective(): ng.IDirective {
  return {
    restrict: 'E',
    scope: {
      currentState: '&'
    },
    templateUrl: '/components/resource-indicator/resource-indicator.html'
  };
}

export = createResourceIndicatorDirective;
