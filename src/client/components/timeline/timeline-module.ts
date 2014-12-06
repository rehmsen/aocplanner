/// <reference path="../../../../typings/angularjs/angular.d.ts" />

import timelineLayoutDirectives = require('./timeline-layout-directives');
import createTimelinePickerDirective = require('./picker-directive');



var timelineModule = angular.module('timelineModule', []);

timelineModule.directive('timelinePicker', createTimelinePickerDirective);
timelineModule.directive('timelineContainer', timelineLayoutDirectives.createContainerDirective);
timelineModule.directive('startTime', timelineLayoutDirectives.createStartTimeDirective);

export = timelineModule;
