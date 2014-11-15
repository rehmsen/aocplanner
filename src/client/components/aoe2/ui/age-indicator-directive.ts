/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

function createAgeIndicatorDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2-ui/age-indicator.html',
    restrict: 'E',
    scope: {
      age: '='
    },
    link: function postLink(
      scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
    }
  };
}

export = createAgeIndicatorDirective;
