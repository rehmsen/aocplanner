/// <reference path="../../../../typings/angularjs/angular.d.ts" />

import createAgeIndicatorDirective = require('./age-indicator-directive');
import createBuildOrderItemDirective = require('./build-order-item-directive');
import createResourceIndicatorDirective = require('./resource-indicator-directive');
import createTaskAssignmentDirective = require('./task-assignment-directive');


var aoe2Ui = angular.module('aoe2Ui', []);

aoe2Ui.directive('ageIndicator', createAgeIndicatorDirective);
aoe2Ui.directive('buildOrderItem', createBuildOrderItemDirective);
aoe2Ui.directive('resourceIndicator', createResourceIndicatorDirective);
aoe2Ui.directive('taskAssignment', createTaskAssignmentDirective);

export = aoe2Ui;
