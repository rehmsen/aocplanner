/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import core = require('./core');
import build = require('./build');

class BuildOrderService implements core.IBuildOrderService {
  buildOrder: core.IBuildOrderItem[] = [];
  lastResourceSpendTime: number = 0;
  queues: build.Queue[];

  constructor() {
    // TODO(olrehm): Make this map dependent.
    this.queues = [
      new build.Queue('town_center'),
      new build.Queue('villager'),
      new build.Queue('villager'),
      new build.Queue('villager')
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

  enqueueBuildable(
      buildable: core.Buildable, currentTime: number, 
      initialTask?: core.ITask): number {
    var queue = this.queues.filter((queue) => { 
      return queue.source === buildable.source;
    })[0];
    var startTime = Math.max(currentTime, queue.end);
    var item = new build.BuildableStartedItem(
        startTime, buildable, initialTask);
    queue.push(item); 
    this.sortInItem(item);
    var finishedItem = new build.BuildableFinishedItem(item.end, buildable);
    this.sortInItem(finishedItem);
    
    if (buildable.hasQueue) {
      this.queues.push(new build.Queue(buildable.id, item.end));
    }

    return queue.end;
  }

}

export = BuildOrderService;