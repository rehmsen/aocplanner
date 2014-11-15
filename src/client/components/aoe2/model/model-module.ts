/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import BuildOrderService = require('./build-order-service');
import RulesService = require('./rules-service');

var modelModule = angular.module('aoe2ModelModule', []);

modelModule.service('rulesService', RulesService);
modelModule.service('buildOrderService', BuildOrderService);

export = modelModule;