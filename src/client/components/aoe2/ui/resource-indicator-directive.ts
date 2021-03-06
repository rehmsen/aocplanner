/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

interface IResourceIndicatorScope extends ng.IScope {
  Math: Math;
}

function createResourceIndicatorDirective(): ng.IDirective {
  return {
    restrict: 'E',
    scope: {
      currentState: '&'
    },
    templateUrl: '/components/aoe2/ui/resource-indicator.html',
    link: function($scope: IResourceIndicatorScope) {
      $scope.Math = Math;
    }
  };
}

export = createResourceIndicatorDirective;
