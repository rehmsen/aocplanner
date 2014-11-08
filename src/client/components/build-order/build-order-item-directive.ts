/// <reference path="../../../../typings/angularjs/angular.d.ts" />

function createBuildOrderItemDirective(): ng.IDirective {
  return {
    templateUrl: '/components/build-order/build-order-item.html',
    restrict: 'E',
    scope: {
      item: '=',
      timeScale: '='
    },
    link: function postLink(
      scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
    }
  };
}

export = createBuildOrderItemDirective;
