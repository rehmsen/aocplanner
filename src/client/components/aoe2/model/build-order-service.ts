/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import core = require('./core');
import build = require('./build');

class BuildOrderService {
  buildOrder: core.IBuildOrderItem[] = [];
  queues: core.IQueue[];

  constructor() {
    this.queues = [
      {
        source: 'town_center',
        start: 0,
        length: 0,
        items: []
      },
      {
        source: 'villager',
        start: 0,
        length: 0,
        items: []
      },
      {
        source: 'villager',
        start: 0,
        length: 0,
        items: []
      },
      {
        source: 'villager',
        start: 0,
        length: 0,
        items: []
      },      
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

  enqueueBuildableItem(buildable: build.Buildable): core.IQueue {
    var queue = this.queues.filter(function(queue) { 
      return queue.source === buildable.source;
    })[0];
    var offset = 0;
    var item = new build.BuildableItem(
        offset, queue.length + offset, buildable);
    queue.items.push(item); 
    queue.length += item.offset + buildable.buildDuration;
    this.sortInItem(item);
    return queue;
  }

}

export = BuildOrderService;