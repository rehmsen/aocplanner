/// <reference path="../../../typings/angularjs/angular.d.ts" />

var app = angular.module('aocPlannerApp', [ 
	'ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'app/main/main.html',
      //   controller: 'MainCtrl'
      // })
      .otherwise({
        redirectTo: '/'
      });
  });

// app.filter('duration', durationFilter);


//app.controller('MainCtrl', MainController);

