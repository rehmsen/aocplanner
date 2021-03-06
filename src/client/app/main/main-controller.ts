/// <reference path="../../../../typings/angularjs/angular.d.ts" />

import build = require('../../components/aoe2/model/build');
import core = require('../../components/aoe2/model/core');
import assignments = require('../../components/aoe2/model/assignments');
import BuildOrderService = require('../../components/aoe2/model/build-order-service');
import RulesService = require('../../components/aoe2/model/rules-service');
import State = require('../../components/aoe2/model/state');

class MainController {
  timeScale: number = 3;

  settings: core.ISettings;
  currentState: State;
  selection: core.Selection;

  constructor( 
      public buildOrderService: BuildOrderService,
      public rulesService: RulesService) {
    this.settings = {
      resources: 'low',
      allTechs: true
    };
    this.currentState = new State(
        buildOrderService, rulesService, this.settings);

    this.rulesService.load('assets/rules/aoc.yaml').then(() => {
      this.currentState.update(0);
    });

    this.selection = new core.Selection();
  }

}


export = MainController
