/// <reference path="../../../../typings/angularjs/angular.d.ts" />

var exceptionOverride = angular.module('exceptionOverride', []);

exceptionOverride.factory('$exceptionHandler', function() {
  return function(exception: Error, cause?: string): void {
  	if (cause) {
	    exception.message += ' (caused by "' + cause + '")';
  	}
    throw exception;
  };
});

export = exceptionOverride;
