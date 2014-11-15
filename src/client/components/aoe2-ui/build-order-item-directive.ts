/// <reference path="../../../../typings/angularjs/angular.d.ts" />

function createBuildOrderItemDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2-ui/build-order-item.html',
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
