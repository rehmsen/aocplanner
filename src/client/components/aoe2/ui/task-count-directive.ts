/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

function createTaskCountDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2/ui/task-count.html',
    restrict: 'E',
    scope: {
      taskCount: '&',
      selection: '='
    }
  };
}

export = createTaskCountDirective;
