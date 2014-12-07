/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angularjs/angular-route.d.ts" />

import MainController = require('./main/main-controller');
import exceptionOverride = require('../components/exception/exception-override');
import aoe2UiModule = require('../components/aoe2/ui/ui-module');
import aoe2ModelModule = require('../components/aoe2/model/model-module');
import timelineModule = require('../components/timeline/timeline-module');

import createDurationFilter = require('../components/duration/duration-filter');

var app = angular.module('aocPlannerApp', [ 
	'ngRoute', 
  exceptionOverride.name, 
  aoe2UiModule.name, 
  aoe2ModelModule.name,
  timelineModule.name]);

app.config(function ($routeProvider: ng.route.IRouteProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'mainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.controller('MainController', MainController);

app.filter('duration', createDurationFilter);
