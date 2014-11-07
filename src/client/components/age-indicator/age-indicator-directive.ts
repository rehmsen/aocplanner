/// <reference path="../../../../typings/angularjs/angular.d.ts" />

function createAgeIndicatorDirective() {
  return {
    templateUrl: '/components/age-indicator/age-indicator.html',
    restrict: 'E',
    scope: {
      age: '='
    },
    link: function postLink(scope, element, attrs) {
    }
  };
}

export = createAgeIndicatorDirective;
