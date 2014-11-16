/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import core = require('../model/core');

function createTaskAssignmentDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2/ui/task-assignment.html',
    restrict: 'E',
    scope: {
      assignment: '&'
    },
    link: function postLink(
      scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
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
