/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

function createTaskAssignmentDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2-ui/task-assignment.html',
    restrict: 'E',
    scope: {
      assignment: '&'
    },
    link: function postLink(
      scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
    }
  };
}

export = createTaskAssignmentDirective;
