/// <reference path="../../../../../typings/angularjs/angular.d.ts" />

interface ReassignmentDirectiveScope extends ng.IScope {

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
	    	scope.computeWidth = function(reassignment: assignment.ReassignmentItem) {
	    		var duration = reassignment.toTask.computeDuration(reassignment.count);
	    		return duration < Infinity ? duration * scope.timeScale() : 50;
	    	}
	    	scope.durationClass = function(reassignment: assignment.ReassignmentItem) {
	    		var duration = reassignment.toTask.computeDuration(reassignment.count);
				return duration < Infinity ? 'duration-bar' : 'indefinite-duration-bar';	    		
	    	}
	    }
	};
}

export = createReassignmentDirective;