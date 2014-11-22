import assignments = require('./assignments');
import core = require('./core');
import BuildOrderService = require('./build-order-service');
import RulesService = require('./rules-service');

class State implements core.IState {
  resources: core.IResources;
  pop: number;
  popCap: number;
  assignments: {[task: string]: core.IAssignment};
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
  set time(time: number) {
    if (!this.rulesService.loaded) {
      throw new Error(
        'Cannot initialize state before rulesService is loaded.');
    }
    this.time_ = time !== undefined ? time : Number.MAX_VALUE;
    this.resources = angular.copy(
        this.rulesService.startResources[this.settings.resources]);
    // TODO(olrehm): Initialize from rules/settings.
    this.pop = 4;
    this.popCap = 5;
    this.assignments = {
      'idle': new assignments.TaskAssignment(3, new core.IdleTask())
    };
    this.ageIndex = 0;
    this.hasBuilding = {
      'town_center': true
    };
    this.hasTechnology = {};

    var lastTime = 0;
    this.buildOrderService.buildOrder.forEach(function(item) {
      var delta = Math.min(item.start, this.time_) - lastTime;
      angular.forEach(this.assignments, function(assignment: core.IAssignment) {
        assignment.apply(delta, this);
      }, this);

      lastTime += delta;
      if (item.start > this.time_) {
        return;
      }
      
      item.apply(this);
    }, this);
    var delta = this.time_ - lastTime;
    angular.forEach(this.assignments, function(assignment: core.IAssignment) {
      assignment.apply(delta, this);
    }, this);
  }
}

export = State;
