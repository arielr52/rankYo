'use strict';

/**
 * @ngdoc function
 * @name rankYoApp.controller:SurveyCtrl
 * @description
 * # SurveyCtrl
 * Controller of the rankYoApp
 */
angular.module('rankYoApp')
  .controller('SurveyCtrl',['$scope','$http', function ($scope,$http) {
    $scope.survey = {};
    $scope.survey.questions = [
      {category:'efficiency',question: 'The meeting objectives were well understood'},
      {category:'efficiency',question: 'The meeting objectives have been meet'},
      {category:'efficiency',question: 'The meeting was a good use of my time'},
      {category:'engagement',question: 'Participants were engaged (contributed to the discussion and help in achieving the meeting objectives)'},
      {category:'communication',question: 'I could understand what people were saying'},
      {category:'communication',question: 'Participants listen to one another'},
      {category:'culture',question: 'Participants were supportive and respectful to one another'}
    ];
    $scope.submit = function(){
      console.log('survey='+JSON.stringify($scope.survey));
      var req = {
        method: 'POST',
        url: 'http://localhost:8080/api/save',
       // headers: {
      //    'Content-Type': 'application/json'
      //  },
        data: { survey: $scope.survey }
      }

      $http(req).then(function(data ){
        console.log('data='+JSON.stringify(data));
      }, function(data ){
        console.log('data='+JSON.stringify(data));
      });
    }
  }]);

