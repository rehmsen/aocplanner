/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import core = require('../model/core');

function createTaskCountDirective(): ng.IDirective {
  return {
    templateUrl: '/components/aoe2/ui/task-count.html',
    restrict: 'E',
    scope: {
      taskCount: '&',
      selection: '='
    },
    controller: TaskCountDirectiveController,
    controllerAs: 'ctrl',
    bindToController: true
  };
}

class TaskCountDirectiveController {
  taskCount: () => core.ITaskCount;
  selection: core.Selection;

  addOrSet() {
    var added = this.selection.add(this.taskCount().assignable, this.taskCount().task);
    if (!added) {
      this.selection.set(this.taskCount().assignable, this.taskCount().task);
    }
  }
}

export = createTaskCountDirective;
