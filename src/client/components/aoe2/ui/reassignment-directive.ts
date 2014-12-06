/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import assignments = require('../model/assignments');
import core = require('../model/core');

interface ReassignmentDirectiveScope extends ng.IScope {
	computeWidth(task: core.ITask, count: number): number;
	durationClass(task: core.ITask): string;
  sequence(): assignments.ReassignmentItem[];
  timeScale(): number;	
}


function createReassignmentDirective(): ng.IDirective {
	return {
		templateUrl: '/components/aoe2/ui/reassignment.html',
		restrict: 'E',
		scope: {
			sequence: '&',
			timeScale: '&'
		},
	    link: function postLink(
	        scope: ReassignmentDirectiveScope, 
	        element: ng.IAugmentedJQuery, 
	        attrs: ng.IAttributes): void {
	    	scope.computeWidth = function(task: core.ITask, count: number) {
	    		var duration = task.computeDuration(count);
	    		return duration < Infinity ? duration * scope.timeScale() : 50;
	    	}
	    	scope.durationClass = function(task: core.ITask) {
	    		var duration = task.computeDuration(1);
					return duration < Infinity ? 'duration-bar' : 'indefinite-duration-bar';	    		
	    	}
	    }
	};
}

export = createReassignmentDirective;