/// <reference path="../../../../typings/angularjs/angular.d.ts" />

import core = require('../../components/aoe2/model/core');
import assignments = require('../../components/aoe2/model/assignments');
import BuildOrderService = require('../../components/aoe2/model/build-order-service');
import RulesService = require('../../components/aoe2/model/rules-service');
import State = require('../../components/aoe2/model/state');

class MainController {
  timeScale: number = 3;

  settings: core.ISettings;
  currentState: State;

  constructor($scope, 
      public buildOrderService: BuildOrderService,
      public rulesService: RulesService) {
    this.settings = {
      resources: 'low',
      allTechs: true
    };
    this.currentState = new State(
        buildOrderService, rulesService, this.settings);

    this.rulesService.load('assets/rules/aoc.yaml').then(function() {
      this.currentState.time = 0;
    }.bind(this));
  }

}


export = MainController
