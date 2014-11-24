/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

function createSelectionDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2/ui/selection.html',
    restrict: 'E',
    scope: {
      selection: '='
    }
  };
}

export = createSelectionDirective;