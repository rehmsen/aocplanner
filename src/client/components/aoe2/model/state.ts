import assignments = require('./assignments');
import build = require('./build');
import core = require('./core');
import BuildOrderService = require('./build-order-service');
import RulesService = require('./rules-service');

class State implements core.IState {
  resources: core.IResources;
  pop: number;
  popCap: number;
  assignments: {[task: string]: core.ITaskCount};
  age: core.IAge;
  ageProgress: number;
  hasBuilding: {[buildingId: string]: boolean};
  hasTechnology: {[technologyId: string]: boolean};

  constructor(
    private buildOrderService: BuildOrderService,
    private rulesService: RulesService,
    private settings: core.ISettings) {
  }

  private ageIndex_: number;
  get ageIndex(): number {
    return this.ageIndex_;
  }

  set ageIndex(ageIndex: number) {
    this.ageProgress = 0;
    this.ageIndex_ = ageIndex;
    this.age = this.rulesService.ages[ageIndex];
  }

  private time_: number;
  get time(): number {
    return this.time_;
  }

  update(time: number) {
    this.interpolate_(time);
  }
  // Prefer the less surprising update(t), keeping this setter only since
  // it works with 2 way binding.
  set time(t: number) {
    this.update(t);
  }

  buildNext(buildable: core.Buildable): build.BuildableStartedItem {
    this.advanceUntilSufficientResources_(buildable.cost);
    var item = this.buildOrderService.enqueueBuildable(
      buildable, this.time);  
    return item;
  }

  private advanceUntilSufficientResources_(cost: core.IResources) {
    var start = Math.max(
      this.buildOrderService.lastResourceSpendTime, this.time_);
    var index = this.interpolate_(start);

    while (true) {
      var resourceRates = this.sumUpResourceRates_();
      var delta = this.timeUntilSufficientResources_(
          cost, resourceRates);

      var lastItem = index >= this.buildOrderService.buildOrder.length;
      if (!lastItem) {
        var item = this.buildOrderService.buildOrder[index];
        var deltaFull = item.start - this.time_;
        delta = Math.min(deltaFull, delta);
      }

      if (delta == Number.POSITIVE_INFINITY) {
        throw new Error('Will never gather enough because we have 0 income.');
      }

      this.applyResourceRates_(resourceRates, delta);
      this.time_ += delta;
      index++;

      if (lastItem || deltaFull > delta) {
        // We gather enough before reaching this item.
        return;
      } else {
        // We need to continue
        item.apply(this);
      }
    };
  }

  private timeUntilSufficientResources_(
      cost: core.IResources, resourceRates: core.IResources): number {
    var result = 0.0;
    angular.forEach(cost, (quantity, resource) => {
      var missing = quantity - this.resources[resource];
      if (missing > 0) {
        result = Math.max(result, missing / resourceRates[resource]);
      }
    });
    return result;
  }

  private sumUpResourceRates_(): core.IResources {
    var result: core.IResources = { lumber: 0, food: 0, gold: 0, stone: 0 };
    angular.forEach(this.assignments, (assignment: core.ITaskCount) => {
      var taskVerb = assignment.task.verb;
      if (taskVerb != core.TaskVerb.harvest) {
        return;
      }
      var source = assignment.task.object; 

      var resource: core.Resource;
      this.rulesService.resourceSources.forEach((resourceSource: core.IResourceSource) => {
        if (resourceSource.id == source) {
          resource = resourceSource.resource;
        }
      });
      if (resource == undefined) {
        throw new Error('Unknown resource source: ' + source);
      }

      var rate = assignment.assignable.tasks[core.TaskVerb[taskVerb]][source];

      if (rate == 0) {
        return;
      }
      result[resource] += assignment.count * rate;    
    });     
    return result;
  }

  private applyResourceRates_(resourceRates: core.IResources, delta: number): void {
    angular.forEach(resourceRates, (rate, resource) => {
      this.resources[resource] += delta * rate;     
    });   
  } 

  private reset_(): void {
    if (!this.rulesService.loaded) {
      throw new Error(
        'Cannot initialize state before rulesService is loaded.');
    }

    this.resources = angular.copy(
        this.rulesService.startResources[this.settings.resources]);
    // TODO(rehmsen): Initialize from rules/settings.
    this.pop = 4;
    this.popCap = 5;
    var villager = this.rulesService.workers.filter((unit) => { 
      return unit.id == 'villager'; 
    })[0];
    this.assignments = {
      'idle': {count: 3, task: new core.IdleTask(), assignable: villager}
    };
    this.ageIndex = 0;
    this.hasBuilding = {
      'town_center': true
    };
    this.hasTechnology = {};
    this.time_ = 0;
  }

  private interpolate_(time: number): number {
    this.reset_();

    var lastIndex: number = 0;
    this.buildOrderService.buildOrder.forEach((item) => {
      var delta = Math.min(item.start, time) - this.time_;
      this.time_ += delta;
      var resourceRates = this.sumUpResourceRates_();
      this.applyResourceRates_(resourceRates, delta);

      if (item.start > time) {
        return;
      }
      lastIndex++;
      item.apply(this);
    });
    var resourceRates = this.sumUpResourceRates_();
    this.applyResourceRates_(resourceRates, time - this.time_);
    this.time_ = time;
    return lastIndex;
  }
}

export = State;
