/// <reference path="../../../../typings/angularjs/angular.d.ts" />

import timelineLayoutDirectives = require('./timeline-layout-directives');
import createTimelineDirective = require('./timeline-directive');



var timelineModule = angular.module('timelineModule', []);

timelineModule.directive('timeline', createTimelineDirective);
timelineModule.directive('timelineContainer', timelineLayoutDirectives.createContainerDirective);
timelineModule.directive('startTime', timelineLayoutDirectives.createStartTimeDirective);

export = timelineModule;
