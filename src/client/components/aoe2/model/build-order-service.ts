/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import core = require('./core');
import build = require('./build');

class BuildOrderService {
  buildOrder: core.IBuildOrderItem[] = [];
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
    // TODO(oler): Replace with binary search.
    var index = 0;
    this.buildOrder.forEach(function(eachItem) {
      if (eachItem.start > item.start) {
        return;
      }
      index++;
    });
    this.buildOrder.splice(index, 0, item);    
  }

  enqueueBuildableItem(
      buildable: build.Buildable, currentTime: number): build.Queue {
    var queue = this.queues.filter(function(queue) { 
      return queue.source === buildable.source;
    })[0];
    var startTime = Math.max(currentTime, queue.end);
    var item = new build.BuildableStartedItem(startTime, buildable);
    queue.push(item); 
    this.sortInItem(item);
    var finishedItem = new build.BuildableFinishedItem(item.end, buildable);
    this.sortInItem(finishedItem);
    return queue;
  }

}

export = BuildOrderService;