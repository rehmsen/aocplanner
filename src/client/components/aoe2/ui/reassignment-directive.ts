/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

import assignments = require('../model/assignments');
import core = require('../model/core');

interface ReassignmentDirectiveScope extends ng.IScope {
	shouldShow(): boolean;
	computeWidth(reassignment: assignments.ReassignmentItem): number;
	durationClass(reassignment: assignments.ReassignmentItem): string;
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
	    	scope.shouldShow = function(): boolean {
	    		if (scope.sequence().length == 0) {
	    			return false;
	    		}
	    		var reassignment = scope.sequence()[0];
	    		return reassignment.end < Infinity || !reassignment.fromTask.initial;
	    	}

	    	scope.computeWidth = function(reassignment: assignments.ReassignmentItem) {
	    		return reassignment.duration < Infinity ? 
	    		    reassignment.duration * scope.timeScale() : 
	    		    50;
	    	}
	    	scope.durationClass = function(reassignment: assignments.ReassignmentItem) {
					return reassignment.duration < Infinity ? 'duration-bar' : 'indefinite-duration-bar';	    		
	    	}
	    }
	};
}

export = createReassignmentDirective;