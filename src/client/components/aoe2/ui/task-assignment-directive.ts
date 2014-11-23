/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

function createTaskAssignmentDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2/ui/task-assignment.html',
    restrict: 'E',
    scope: {
      assignment: '&',
      selection: '=',
      assignable: '='
    }
  };
}

export = createTaskAssignmentDirective;
