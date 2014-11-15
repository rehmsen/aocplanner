/// <reference path="../../../typings/angularjs/angular.d.ts" />

import MainController = require('./main/main-controller');
import exceptionOverride = require('../components/exception/exception-override');
import aoe2Ui = require('../components/aoe2-ui/aoe2-ui-module');
import aoe2ModelModule = require('../components/aoe2/model/model-module');

import createDurationFilter = require('../components/duration/duration-filter');
import createTimelineDirective = require('../components/timeline/timeline-directive');

var app = angular.module('aocPlannerApp', [ 
	'ngRoute', exceptionOverride.name, aoe2Ui.name, aoe2ModelModule.name]);

app.config(function ($routeProvider) {
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

app.directive('timeline', createTimelineDirective);

app.filter('duration', createDurationFilter);
