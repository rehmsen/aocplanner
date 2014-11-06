/// <reference path="../../../typings/angularjs/angular.d.ts" />

import MainController = require('./main/main-controller');

var app = angular.module('aocPlannerApp', [ 
	'ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.controller('MainCtrl', MainController);

// app.filter('duration', durationFilter);



