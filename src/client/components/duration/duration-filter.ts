
function durationFilter() {
  return function (seconds) {
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var minutesRest = minutes % 60;
    var secondsRest = Math.floor(seconds) % 60;
    return hours + ':' + (minutesRest < 10 ? '0' : '') + minutesRest + 
                   ':' + (secondsRest < 10 ? '0' : '') + secondsRest;
  };
}

export = durationFilter;