/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

function createAgeIndicatorDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2/ui/age-indicator.html',
    restrict: 'E',
    scope: {
      age: '=',
      progress: '='
    }
  };
}

export = createAgeIndicatorDirective;
