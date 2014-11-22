/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import core = require('./core');
import build = require('./build');

class BuildOrderService {
  buildOrder: core.IBuildOrderItem[] = [];
  queues: core.Queue[];

  constructor() {
    // TODO(olrehm): Make this map dependent.
    this.queues = [
      new core.Queue('town_center'),
      new core.Queue('villager'),
      new core.Queue('villager'),
      new core.Queue('villager')
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
      buildable: build.Buildable, currentTime: number): core.Queue {
    var queue = this.queues.filter(function(queue) { 
      return queue.source === buildable.source;
    })[0];
    var queueEnd = queue.start + queue.length;
    var startTime = Math.max(currentTime, queueEnd);
    var offset = startTime - queueEnd;
    var item = new build.BuildableStartedItem(
        offset, startTime, buildable);
    queue.items.push(item); 
    queue.length += item.offset + buildable.buildDuration;
    this.sortInItem(item);
    var finishedItem = new build.BuildableFinishedItem(
        0, queue.length, buildable);
    this.sortInItem(finishedItem);
    return queue;
  }

}

export = BuildOrderService;