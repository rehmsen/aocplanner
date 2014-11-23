/// <reference path="../../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../../typings/js-yaml/js-yaml.d.ts" />

import core = require('./core');
import build = require('./build');

class RulesService {
  loaded: boolean = false;
  loadingPromise: ng.IPromise<{}>;

  ages: core.IAge[] = [];
  civilizations: core.ICivilization[];
  startResources: {[key: string]: core.IResources};

  buildings: build.Building[];
  technologies: build.Technology[];
  units: build.Unit[];
  workers: build.Unit[];
  resourceSources: core.IResourceSource[];
  tasks: {[verb: string]: core.ITask[]} = {};

  private _http: ng.IHttpService;

  constructor($http: ng.IHttpService) {
    this._http = $http;
  }

  load(uri: string): ng.IPromise<{}> {
    this.loadingPromise = this._http.get(uri).
        success((data: string, status: number, 
            headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
          var rules = jsyaml.safeLoad(data);
          this.civilizations = rules.civilizations;
          this.ages = rules.ages.map((age: core.IAge, index: number) => {
            age.index = index;
            return age;
          });
          this.resourceSources = rules.resourceSources;

          this.buildings = rules.buildings.map(build.Building.create);
          this.technologies = rules.technologies.map(build.Technology.create);
          this.units = rules.units.map(build.Unit.create);

          this.workers = this.units.filter((unit: build.Unit) => { 
            return unit.tasks !== undefined; 
          });

          this.tasks['idle'] = [new core.IdleTask()];
          this.tasks['harvest'] = this.resourceSources.map((resourceSource: any) => {
            return new core.HarvestTask(resourceSource);
          });
          this.tasks['construct'] = this.buildings.map((building: build.Building) => {
            return new build.ConstructionTask(building);
          });

          this.startResources = {};
          angular.forEach(rules.startResources, (resources, key) => {
            this.startResources[key] = resources;
          }, this);
          this.loaded = true;
        }).
        error(function(data: string, status: number, 
            headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) {
          console.log(data);
        });
    return this.loadingPromise;
  }
}

export = RulesService;