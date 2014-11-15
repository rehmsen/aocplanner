/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import RulesService = require('./rules-service');


var modelModule = angular.module('aoe2ModelModule', []);

modelModule.service('rulesService', RulesService);

export = modelModule;