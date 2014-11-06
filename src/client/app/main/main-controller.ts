/// <reference path="../../../../typings/angularjs/angular.d.ts" />

// interface IMainControllerScope extends ng.IScope {
//   buildOrder: 
// }

class MainController {
  constructor($scope, $http: ng.IHttpService) {
    $http.get('assets/rules/aoc.yaml').
        success(function(data, status, headers, config) {
          // var rules = jsyaml.safeLoad(data);
          // $scope.civilizations = rules.civilizations;
          // $scope.ages = [];
          // rules.ages.forEach(function(age, index) {
          //   age.index = index;
          //   $scope.ages.push(age);
          // });
          // $scope.age = $scope.ages[0];
          // $scope.buildings = rules.buildings;
          // $scope.technologies = rules.technologies;
          // $scope.units = rules.units;
          // $scope.startResources = rules.startResources;
          // $scope.loaded = true;
        }).
        error(function(data, status, headers, config) {
          console.log(data);
        });
    $scope.buildOrder = [];
    $scope.hasBuildings = {
      'town_center': true
    };
    $scope.settings = {
      resources: 'low'
    };
    $scope.queues = [
      {
        buildingId: 'town_center',
        start: 0,
        length: 0,
        items: []
      },
      {
        buildingId: 'villager',
        start: 0,
        length: 0,
        items: []
      },
      {
        buildingId: 'villager',
        start: 0,
        length: 0,
        items: []
      },
      {
        buildingId: 'villager',
        start: 0,
        length: 0,
        items: []
      },      
    ];
    $scope.isAllTechs = true;
    $scope.interpolateState = function(time) {
      if (!$scope.loaded) {
        return;
      }
      time = time !== undefined ? time : Number.MAX_VALUE;
      var state = {
        resources: angular.copy($scope.startResources[$scope.settings.resources]),
        pop: 4, 
        popCap: 5
      };
      $scope.buildOrder.forEach(function(item) {
        if (item.start > time) {
          return;
        }

        if (item.subject.room) {
          state.popCap += item.subject.room;
        }
        if (item.type === 'unit') {
          state.pop++;
        }
        angular.forEach(item.subject.cost, function(quantity, resource) {
          state.resources[resource] -= quantity;
        });
      });
      return state;
    };
    $scope.timeScale = 3;
    $scope.t = 0;

    $scope.build = function(building) {
      building.building = 'villager';
      var queue = this.enqueue_({
        type: 'building',
        subject: building
      });
      var completionTime = queue.length;
      $scope.queues.push({
        buildingId: building.id,
        start: completionTime, 
        length: 0,
        items: []
      });
      $scope.hasBuildings[building.id] = true;
    };
    $scope.research = function(tech) {
      tech.researched = true;
      this.enqueue_({
        type: 'tech',
        subject: tech
      });
    };
    $scope.train = function(unit) {
      this.enqueue_({
        type: 'unit',
        subject: unit
      });
    };

    $scope.enqueue_ = function(item) {
      var queue = $scope.queues.filter(function(queue) { 
        return queue.buildingId === item.subject.building;
      })[0];
      item.offset = 0;
      item.start = queue.length + item.offset;
      queue.items.push(item);
      queue.length += item.offset + item.subject.buildDuration;

      // TODO(oler): Replace with binary search.
      var index = 0;
      $scope.buildOrder.forEach(function(eachItem) {
        if (eachItem.start > item.start) {
          return;
        }
        index++;
      });
      $scope.buildOrder.splice(index, 0, item);
      $scope.t = queue.start + queue.length;
      return queue;
    };
  }
}

export = MainController
