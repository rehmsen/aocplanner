/// <reference path="../../../../typings/angularjs/angular.d.ts" />

interface ITimelineDirectiveScope extends ng.IScope {
  click: ($event: ng.IAngularEvent)=>void;
  time: number;
  timeScale: number;
}

interface IAngularClickEvent extends ng.IAngularEvent {
  layerX: number;
  layerY: number;
}

function createTimelineDirective(): ng.IDirective {
  return {
    templateUrl: '/components/timeline/timeline.html',
    restrict: 'E',
    scope: {
      time: '=',
      timeScale: '='
    },
    link: function postLink(
        scope: ITimelineDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
      scope.click = function($event: IAngularClickEvent): void {
        scope.time = $event.layerX / scope.timeScale;
      };
    }
  };
}

export = createTimelineDirective;
