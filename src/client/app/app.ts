/// <reference path="../../../typings/angularjs/angular.d.ts" />

import MainController = require('./main/main-controller');
import exceptionOverride = require('../components/exception/exception-override');

import createAgeIndicatorDirective = require('../components/aoe2-ui/age-indicator-directive');
import createBuildOrderItemDirective = require('../components/aoe2-ui/build-order-item-directive');
import createResourceIndicatorDirective = require('../components/aoe2-ui/resource-indicator-directive');
import createDurationFilter = require('../components/duration/duration-filter');
import createTimelineDirective = require('../components/timeline/timeline-directive');

var app = angular.module('aocPlannerApp', [ 
	'ngRoute', exceptionOverride.name]);

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

app.directive('ageIndicator', createAgeIndicatorDirective);
app.directive('buildOrderItem', createBuildOrderItemDirective);
app.directive('resourceIndicator', createResourceIndicatorDirective);
app.directive('timeline', createTimelineDirective);

app.filter('duration', createDurationFilter);
