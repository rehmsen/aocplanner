/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import createAgeIndicatorDirective = require('./age-indicator-directive');
import createBuildOrderItemDirective = require('./build-order-item-directive');
import createBuildPaneDirective = require('./build-pane-directive');
import createResourceIndicatorDirective = require('./resource-indicator-directive');
import createSelectionDirective = require('./selection-directive');
import createTaskCountDirective = require('./task-count-directive');


var uiModule = angular.module('aoe2UiModule', []);

uiModule.directive('ageIndicator', createAgeIndicatorDirective);
uiModule.directive('buildOrderItem', createBuildOrderItemDirective);
uiModule.directive('buildPane', createBuildPaneDirective);
uiModule.directive('resourceIndicator', createResourceIndicatorDirective);
uiModule.directive('selection', createSelectionDirective);
uiModule.directive('taskCount', createTaskCountDirective);

export = uiModule;
