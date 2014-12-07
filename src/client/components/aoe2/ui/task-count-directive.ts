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
    var taskCount = this.taskCount();
    if (this.selection.isCompatible(taskCount.assignable, taskCount.task)) {
      if (!this.selection.taskCount || this.selection.taskCount.count < taskCount.count) {
        this.selection.add(taskCount.assignable, taskCount.task);
      }
    } else {
      this.selection.set(taskCount.assignable, taskCount.task);
    }
  }
}

export = createTaskCountDirective;
