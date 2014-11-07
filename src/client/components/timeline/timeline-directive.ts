/// <reference path="../../../../typings/angularjs/angular.d.ts" />

function createTimelineDirective() {
  return {
    templateUrl: '/components/timeline/timeline.html',
    restrict: 'E',
    scope: {
      time: '=',
      timeScale: '='
    },
    link: function postLink(scope, element, attrs) {
      scope.click = function($event) {
        scope.time = $event.layerX / scope.timeScale;
      };
    }
  };
}

export = createTimelineDirective;
