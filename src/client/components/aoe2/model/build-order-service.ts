/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import assignments = require('./assignments');
import core = require('./core');
import build = require('./build');

class BuildOrderService {
  buildOrder: core.IBuildOrderItem[] = [];
  lastResourceSpendTime: number = 0;
  queues: build.Queue[];
  assignmentSequences: assignments.ReassignmentItem[][] = [];

  constructor() {
    // TODO(olrehm): Make this map dependent.
    this.queues = [
      new build.Queue('town_center')
    ];    
  }

  sortInItem(item: core.IBuildOrderItem) {
    if (item.isSpendingResources && this.lastResourceSpendTime < item.start) {
      this.lastResourceSpendTime = item.start;
    }

    // TODO(oler): Replace with binary search.
    var index = 0;
    this.buildOrder.forEach((eachItem) => {
      if (eachItem.start > item.start) {
        return;
      }
      index++;
    });
    this.buildOrder.splice(index, 0, item);    
  }

  enqueueBuildable(buildable: core.Buildable, 
      currentTime: number): build.BuildableStartedItem {
    var startTime = currentTime;
    var queue: build.Queue;
    if (buildable.source) {
      queue = this.queues.filter((queue) => { 
        return queue.source === buildable.source;
      })[0];
      startTime = Math.max(currentTime, queue.end);
    }
    var item = new build.BuildableStartedItem(
        startTime, buildable);

    if (queue) {
      queue.push(item);
    }
    this.sortInItem(item);
    var finishedItem = new build.BuildableFinishedItem(item.end, buildable);
    this.sortInItem(finishedItem);
    
    if (buildable.hasQueue) {
      this.queues.push(new build.Queue(buildable.id, item.end));
    }

    return item;
  }

}

export = BuildOrderService;