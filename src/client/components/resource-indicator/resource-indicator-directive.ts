/// <reference path="../../../../typings/angularjs/angular.d.ts" />

function createResourceIndicatorDirective() {
  return {
    restrict: 'E',
    scope: {
      currentState: '&'
    },
    templateUrl: '/components/resource-indicator/resource-indicator.html', 
    controller: ['$scope', '$element', function($scope, $element) {
    }]
  };
}

export = createResourceIndicatorDirective;
