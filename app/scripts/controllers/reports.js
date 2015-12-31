'use strict';

/**
 * @ngdoc function
 * @name rankYoApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the rankYoApp
 */
angular.module('rankYoApp')
  .controller('ReportsCtrl', ['$scope', '$http', function ($scope, $http) {


    var survey = [{"questions":[{"category":"efficiency","question":"The meeting objectives were well understood","select":"1"},{"category":"efficiency","question":"The meeting objectives have been meet","select":"1"},{"category":"efficiency","question":"The meeting was a good use of my time","select":"5"},{"category":"engagement","question":"Participants were engaged (contributed to the discussion and help in achieving the meeting objectives)","select":"1"},{"category":"communication","question":"I could understand what people were saying","select":"5"},{"category":"communication","question":"Participants listen to one another","select":"5"},{"category":"culture","question":"Participants were supportive and respectful to one another","select":"2"}],"all":3,"efficiency":2.3333333333333335,"engagement":1,"communication":5,"culture":2,"date":"2015-12-29T05:00:00.000Z","subject":"sub1","owner":"raz","duration":30},
      {"questions":[{"category":"efficiency","question":"The meeting objectives were well understood","select":"5"},{"category":"efficiency","question":"The meeting objectives have been meet","select":"5"},{"category":"efficiency","question":"The meeting was a good use of my time","select":"5"},{"category":"engagement","question":"Participants were engaged (contributed to the discussion and help in achieving the meeting objectives)","select":"1"},{"category":"communication","question":"I could understand what people were saying","select":"5"},{"category":"communication","question":"Participants listen to one another","select":"5"},{"category":"culture","question":"Participants were supportive and respectful to one another","select":"2"}],"all":4,"efficiency":5,"engagement":1,"communication":5,"culture":2,"date":"2015-12-30T05:00:00.000Z","subject":"sub1","owner":"raz","duration":30},
      {"questions":[{"category":"efficiency","question":"The meeting objectives were well understood","select":"5"},{"category":"efficiency","question":"The meeting objectives have been meet","select":"2"},{"category":"efficiency","question":"The meeting was a good use of my time","select":"2"},{"category":"engagement","question":"Participants were engaged (contributed to the discussion and help in achieving the meeting objectives)","select":"1"},{"category":"communication","question":"I could understand what people were saying","select":"5"},{"category":"communication","question":"Participants listen to one another","select":"5"},{"category":"culture","question":"Participants were supportive and respectful to one another","select":"2"}],"all":3.142857142857143,"efficiency":3,"engagement":1,"communication":5,"culture":2,"date":"2015-12-30T05:00:00.000Z","subject":"sub2","owner":"raz","duration":30},
      {"questions":[{"category":"efficiency","question":"The meeting objectives were well understood","select":"5"},{"category":"efficiency","question":"The meeting objectives have been meet","select":"2"},{"category":"efficiency","question":"The meeting was a good use of my time","select":"2"},{"category":"engagement","question":"Participants were engaged (contributed to the discussion and help in achieving the meeting objectives)","select":"1"},{"category":"communication","question":"I could understand what people were saying","select":"5"},{"category":"communication","question":"Participants listen to one another","select":"5"},{"category":"culture","question":"Participants were supportive and respectful to one another","select":"1"}],"all":1,"efficiency":3,"engagement":1,"communication":5,"culture":1,"date":"2015-12-30T05:00:00.000Z","subject":"sub2","owner":"ariel","duration":30},
      {"questions":[{"category":"efficiency","question":"The meeting objectives were well understood","select":"1"},{"category":"efficiency","question":"The meeting objectives have been meet","select":"1"},{"category":"efficiency","question":"The meeting was a good use of my time","select":"2"},{"category":"engagement","question":"Participants were engaged (contributed to the discussion and help in achieving the meeting objectives)","select":"1"},{"category":"communication","question":"I could understand what people were saying","select":"1"},{"category":"communication","question":"Participants listen to one another","select":"5"},{"category":"culture","question":"Participants were supportive and respectful to one another","select":"1"}],"all":2.7142857142857142,"efficiency":1.3333333333333333,"engagement":1,"communication":3,"culture":1,"date":"2015-12-29T05:00:00.000Z","subject":"sub2","owner":"ariel","duration":30},
      {"questions":[{"category":"efficiency","question":"The meeting objectives were well understood","select":"5"},{"category":"efficiency","question":"The meeting objectives have been meet","select":"1"},{"category":"efficiency","question":"The meeting was a good use of my time","select":"2"},{"category":"engagement","question":"Participants were engaged (contributed to the discussion and help in achieving the meeting objectives)","select":"1"},{"category":"communication","question":"I could understand what people were saying","select":"1"},{"category":"communication","question":"Participants listen to one another","select":"5"},{"category":"culture","question":"Participants were supportive and respectful to one another","select":"1"}],"all":2.2857142857142856,"efficiency":2.6666666666666665,"engagement":1,"communication":3,"culture":1,"date":"2015-12-29T05:00:00.000Z","subject":"sub1","owner":"ariel","duration":30},
    ];

    var req = {
      method: 'GET',
      url: 'http://localhost:8080/api/report'
    }

    $http(req).then(function (data) {
      console.log('data='+JSON.stringify(data));
      //var str =JSON.stringify(data.data);
      //chart(JSON.parse(str));
      chart(data.data);
    }, function (data) {
      //console.log('data error ='+JSON.stringify(data));
    });

   // chart(survey);


    function chart(data){
      var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
      var parseDate = d3.time.format("%Y%m%d").parse;

      var x = d3.time.scale()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var color = d3.scale.category10();

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var line = d3.svg.line()
        .interpolate("basis")
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.rank);
        });

      var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      var domain = 'owner';
      color.domain(d3.keys(data[0]).filter(function (key) {
        return key === domain;
      }));
      var lines = {};
      data.forEach(function (d) {
       // d.date = new Date(d.date);
        var test =new Date(d.date);
        if(!lines[d.owner]) {
          lines[d.owner] = {name: d.owner, values: []};
        }
        lines[d.owner].values.push({date:test,rank: d.all});
      });
      var categories = [];
      Object.keys(lines).forEach(function(key){
        categories.push(lines[key]);
      });

      x.domain(d3.extent(data, function (d) {
        return new Date(d.date);
      }));

      y.domain([
        d3.min(categories, function (c) {
          return d3.min(c.values, function (v) {
            return v.rank;
          });
        }),
        d3.max(categories, function (c) {
          return d3.max(c.values, function (v) {
            return v.rank;
          });
        })
      ]);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Ranking");

      var city = svg.selectAll(".city")
        .data(categories)
        .enter().append("g")
        .attr("class", "city");

      city.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
          console.log('values='+JSON.stringify(d.values));
          console.log('line='+JSON.stringify(line(d.values)));
          return line(d.values);
        })
        .style("stroke", function (d) {
          return color(d.name);
        });

      city.append("text")
        .datum(function (d) {
          return {name: d.name, value: d.values[d.values.length - 1]};
        })
        .attr("transform", function (d) {
          return "translate(" + x(d.value.date) + "," + y(d.value.rank) + ")";
        })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function (d) {
          return d.name;
        });
    }



  }]);

