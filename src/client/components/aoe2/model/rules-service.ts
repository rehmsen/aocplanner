/// <reference path="../../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../../typings/js-yaml/js-yaml.d.ts" />

import core = require('./core');
import build = require('./build');

class RulesService {
  loaded: boolean = false;
  loadingPromise: ng.IPromise<{}>;

  ages: core.IAge[] = [];
  civilizations: core.ICivilization[];
  startResources: {low: core.Resources};

  buildings: build.Building[];
  technologies: build.Technology[];
  units: build.Unit[];
  resourceSources: core.IResourceSource[];
  tasks: core.Task[];

  private _http: ng.IHttpService;

  constructor($http: ng.IHttpService) {
    this._http = $http;
  }

  load(uri: string): ng.IPromise<{}> {
    this.loadingPromise = this._http.get(uri).
        success(function(data: string, status: number, 
            headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) {
          var rules = jsyaml.safeLoad(data);
          this.civilizations = rules.civilizations;
          this.ages = rules.ages.map(function(age, index) {
            age.index = index;
            return age;
          });
          this.buildings = rules.buildings.map(build.Building.create);
          this.technologies = rules.technologies.map(build.Technology.create);
          this.units = rules.units.map(build.Unit.create);
          this.resourceSources = rules.resourceSources;
          this.tasks = this.resourceSources.map(function(resourceSource) {
            return core.Task.createHarvest(resourceSource.id);
          });
          this.tasks.push(core.Task.createIdle());
          //this.tasks.push(core.Task.create);

          this.startResources = {};
          angular.forEach(rules.startResources, function(resources, key) {
            this.startResources[key] = core.Resources.create(resources);
          }, this);
          this.loaded = true;
        }.bind(this)).
        error(function(data: string, status: number, 
            headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) {
          console.log(data);
        });
    return this.loadingPromise;
  }
}

export = RulesService;