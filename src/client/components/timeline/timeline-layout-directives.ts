/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/jquery/jquery.d.ts" />

export function createContainerDirective(): ng.IDirective {
  return {
    template: '<div ng-transclude class="container"></div>',
    transclude: true,
    restrict: 'E',
    scope: {
      timeScale: '='
    },
    controller: ContainerController,
    controllerAs: 'ctrl',
    bindToController: true
  };
}

export function createStartTimeDirective($timeout: ng.ITimeoutService): ng.IDirective {
  return {
    restrict: 'A',
    require: '^timelineContainer',
    link: function postLink(
        scope: IStartTimeDirectiveScope, element: ng.IAugmentedJQuery, 
        attrs: ng.IAttributes, timelineContainerCtrl: ContainerController) {
      element.css('position', 'absolute');
      $timeout(function() {
        timelineContainerCtrl.registerItem({
          start: parseInt(attrs['startTime']), 
          originX: parseInt(attrs['originX']) || 0,
          element: element,
          scope: scope
        });
      });
    }
  };
}

class ContainerController {
  timeScale: number;
  private items: IItem[] = [];
  private rows: { height: number; end: number; }[] = [];

  registerItem(item: IItem): void {
    // Get width first, because it can be reset to 0 on DOM modifications.
    var width = item.element[0].offsetWidth;
    this.items.push(item);
    var left = item.originX + item.start * this.timeScale;
    item.element.css('left', left + 'px');
    var top = 0;
    var itemEnd = left + width;
    var placed = this.rows.some((row) => {
      if (row.end < left) {
        row.end = itemEnd;
        row.height = Math.max(row.height, item.element[0].offsetHeight);
        return true;
      }
      top += row.height;
      return false;
    });
    item.element.css('top', top + 'px');
    if (!placed) {
      this.rows.push({height: item.element[0].offsetHeight, end: itemEnd});
    }
  }
}

interface IItem {
  start: number;
  originX: number;
  element: ng.IAugmentedJQuery;
  scope: IStartTimeDirectiveScope;
}

interface IStartTimeDirectiveScope extends ng.IScope {
  startTime: number;
}
