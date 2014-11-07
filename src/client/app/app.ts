/// <reference path="../../../typings/angularjs/angular.d.ts" />

import MainController = require('./main/main-controller');

import createAgeIndicatorDirective = require('../components/age-indicator/age-indicator-directive');
import createBuildOrderItemDirective = require('../components/build-order/build-order-item-directive');
import createDurationFilter = require('../components/duration/duration-filter');
import createResourceIndicatorDirective = require('../components/resource-indicator/resource-indicator-directive');
import createTimelineDirective = require('../components/timeline/timeline-directive');

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

app.directive('ageIndicator', createAgeIndicatorDirective);
app.directive('buildOrderItem', createBuildOrderItemDirective);
app.directive('resourceIndicator', createResourceIndicatorDirective);
app.directive('timeline', createTimelineDirective);

app.filter('duration', createDurationFilter);



