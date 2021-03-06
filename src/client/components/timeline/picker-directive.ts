/// <reference path="../../../../typings/angularjs/angular.d.ts" />

interface ITimelinePickerDirectiveScope extends ng.IScope {
  click: ($event: ng.IAngularEvent)=>void;
  time: number;
  timeScale: number;
}

interface IAngularClickEvent extends ng.IAngularEvent {
  offsetX: number;
  offsetY: number;
}

function createTimelinePickerDirective(): ng.IDirective {
  return {
    templateUrl: '/components/timeline/timeline.html',
    restrict: 'E',
    scope: {
      time: '=',
      timeScale: '='
    },
    link: function postLink(
        scope: ITimelinePickerDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
      scope.click = function($event: IAngularClickEvent): void {
        scope.time = $event.offsetX / scope.timeScale;
      };
    }
  };
}

export = createTimelinePickerDirective;
