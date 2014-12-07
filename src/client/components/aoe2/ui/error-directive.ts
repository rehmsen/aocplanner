/// <reference path="../../../../../typings/angularjs/angular.d.ts" />


interface IErrorDirectiveScope extends ng.IScope {
  message: string;
  displayedMessage: string;
  opacity: number;
}


function createErrorDirective($timeout: ng.ITimeoutService): ng.IDirective {
  return {
    template: '<div class="error" style="opacity: {{opacity}}">{{displayedMessage}}</div>',
    restrict: 'E',
    scope: {
      message: '=',
    },
    link: function postLink(scope: IErrorDirectiveScope) {
      scope.$watch(() => { return scope.message }, function(message) {
        if (message) {
          scope.displayedMessage = message;
          scope.message = '';
          scope.opacity = 1.0;
          $timeout(() => { scope.opacity = 0.0; }, 6000);          
        }
      })
    }
  }
}

export = createErrorDirective;