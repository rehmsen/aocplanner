/// <reference path="../../../../typings/angularjs/angular.d.ts" />

function createDurationFilter(): Function {
  return function (seconds: number): string {
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var minutesRest = minutes % 60;
    var secondsRest = Math.floor(seconds) % 60;
    return hours + ':' + (minutesRest < 10 ? '0' : '') + minutesRest + 
                   ':' + (secondsRest < 10 ? '0' : '') + secondsRest;
  };
}

export = createDurationFilter;