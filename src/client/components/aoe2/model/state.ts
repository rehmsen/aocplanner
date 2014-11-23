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

  update(time: number) {
    this.interpolate_(time);
    this.time_ = time;
  }
  // Prefer the less surprising update(t), keeping this setter only since
  // it works with 2 way binding.
  set time(t: number) {
    this.update(t);
  }

  private reset_(): void {
    if (!this.rulesService.loaded) {
      throw new Error(
        'Cannot initialize state before rulesService is loaded.');
    }

    this.resources = angular.copy(
        this.rulesService.startResources[this.settings.resources]);
    // TODO(olrehm): Initialize from rules/settings.
    this.pop = 4;
    this.popCap = 5;
    var villager = this.rulesService.workers.filter((unit) => { 
      return unit.id == 'villager'; 
    })[0];
    this.assignments = {
      'idle': new assignments.TaskAssignment(3, new core.IdleTask(), villager)
    };
    this.ageIndex = 0;
    this.hasBuilding = {
      'town_center': true
    };
    this.hasTechnology = {};
  }

  private interpolate_(time: number): void {
    this.reset_();

    var done = false;
    var assignmentApplicator = this.newAssignmentApplicator_();
    this.buildOrderService.buildOrder.forEach((item) => {
      if (!done) {
        assignmentApplicator(Math.min(item.start, time));
      }

      if (item.start > time) {
        done = true;
      }
      if (!done) {
        item.apply(this);
      }      
    });
    if (!done) {
      assignmentApplicator(time);
    }
  }

  private newAssignmentApplicator_() {
    var lastTime = 0;
    return (time: number) => {
      var delta = time - lastTime;
      angular.forEach(this.assignments, (assignment: core.IAssignment) => {
        assignment.apply(delta, this);
      });        
      lastTime += delta;      
    };
  }
}

export = State;
