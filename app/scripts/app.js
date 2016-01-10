'use strict';

/**
 * @ngdoc overview
 * @name rankYoApp
 * @description
 * # rankYoApp
 *
 * Main module of the application.
 */
angular
  .module('rankYoApp', [
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap'
  ])
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
      when('/survey', {
        templateUrl: 'views/survey.html',
        controller: 'SurveyCtrl'
      }).
      when('/reports', {
        templateUrl: 'views/reports.html',
        controller: 'ReportsCtrl'
      }).
      otherwise({
        redirectTo: '/survey'
      });
    }]);;
