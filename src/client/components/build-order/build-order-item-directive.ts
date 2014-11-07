/// <reference path="../../../../typings/angularjs/angular.d.ts" />

function createBuildOrderItemDirective() {
  return {
    templateUrl: '/components/build-order/build-order-item.html',
    restrict: 'E',
    scope: {
      item: '=',
      timeScale: '='
    },
    link: function postLink(scope, element, attrs) {
    }
  };
}

export = createBuildOrderItemDirective;
