/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/jquery/jquery.d.ts" />

export function createContainerDirective(): ng.IDirective {
  return {
    template: '<div ng-transclude></div>',
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

export function createStartTimeDirective(): ng.IDirective {
  return {
    restrict: 'A',
    require: '^timelineContainer',
    link: function postLink(
        scope: IStartTimeDirectiveScope, element: ng.IAugmentedJQuery, 
        attrs: ng.IAttributes, timelineContainerCtrl: ContainerController) {
      timelineContainerCtrl.registerItem({
        start: parseInt(attrs['startTime']), 
        element: element,
        scope: scope
      });
    }
  };
}

class ContainerController {
  timeScale: number;
  private items: IItem[] = [];
  private rows: { height: number; end: number; }[] = [];

  registerItem(item: IItem): void {
    this.items.push(item);
    var left = item.start * this.timeScale;
    item.element.css('position', 'absolute');
    item.element.css('left', left + 'px');
    var top = 0;
    var itemEnd = left + item.element[0].offsetWidth;
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
  element: ng.IAugmentedJQuery;
  scope: IStartTimeDirectiveScope;
}

interface IStartTimeDirectiveScope extends ng.IScope {
  startTime: number;
}
