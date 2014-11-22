/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import core = require('../model/core');

interface ITaskAssignmentDirectiveScope extends ng.IScope {
  getTaskIconClass(): string;
  assignment(): core.IAssignment;
}

function createTaskAssignmentDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2/ui/task-assignment.html',
    restrict: 'E',
    scope: {
      assignment: '&',
      selection: '=',
      assignable: '='
    },
    link: function postLink(
      scope: ITaskAssignmentDirectiveScope, element: ng.IAugmentedJQuery, 
      attrs: ng.IAttributes): void {

      scope.getTaskIconClass = function() {
        var task = scope.assignment().task;
        if (task.verb == core.TaskVerb.harvest) {
          return task.object;
        }
        return core.TaskVerb[task.verb]
      }
    }
  };
}

export = createTaskAssignmentDirective;
