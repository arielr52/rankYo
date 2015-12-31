'use strict';

/**
 * @ngdoc function
 * @name rankYoApp.controller:SurveyCtrl
 * @description
 * # SurveyCtrl
 * Controller of the rankYoApp
 */
angular.module('rankYoApp')
  .controller('SurveyCtrl', ['$scope', '$http', function ($scope, $http) {

    function reset() {
      $scope.userMessage = '';
      $scope.survey = {};
      $scope.survey.questions = [
        {category: 'efficiency', question: 'The meeting objectives were well understood'},
        {category: 'efficiency', question: 'The meeting objectives have been meet'},
        {category: 'efficiency', question: 'The meeting was a good use of my time'},
        {
          category: 'engagement',
          question: 'Participants were engaged (contributed to the discussion and help in achieving the meeting objectives)'
        },
        {category: 'communication', question: 'I could understand what people were saying'},
        {category: 'communication', question: 'Participants listen to one another'},
        {category: 'culture', question: 'Participants were supportive and respectful to one another'}
      ];
    }

    reset();

    $scope.submit = function () {
      var survey = $scope.survey;
      var avrg = {all:[]};
      survey.questions.forEach(function (item) {
        if (!avrg[item.category]) {
          avrg[item.category] = [];
        }
        avrg[item.category].push(Number(item.select));
        avrg.all.push(Number(item.select));
      });

      Object.keys(avrg).forEach(function(key){
        survey[key] = avrg[key].reduce(function(sum, a) { return sum + a },0)/(avrg[key].length||1);
      });

      console.log('survey=' + JSON.stringify($scope.survey));
      var req = {
        method: 'POST',
        url: 'http://localhost:8080/api/save',
        data: survey
      }

      $http(req).then(function (data) {
        //console.log('data='+JSON.stringify(data));
        //reset();
        $scope.userMessage = 'Thank you for your input ';
      }, function (data) {
        //console.log('data error ='+JSON.stringify(data));
      });
    }
  }]);

