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

    var req = {
      method: 'GET',
      url: 'http://localhost:8080/api/report'
    }

    $http(req).then(function (data) {
      //console.log('data='+JSON.stringify(data));
      chart(data.data);
    }, function (data) {
      console.log('data error =' + JSON.stringify(data));
    });

    //http://bl.ocks.org/mbostock/3884955#data.tsv


    function chart(data) {
      var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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
      var svg = d3.select("#report").append("svg")
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
        var test = new Date(d.date);
        if (!lines[d.owner]) {
          lines[d.owner] = {name: d.owner, values: []};
        }
        lines[d.owner].values.push({date: test, rank: d.all});
      });
      var categories = [];
      Object.keys(lines).forEach(function (key) {
        //sort
        lines[key].values.sort(function(a, b){return a.date>b.date});
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
        //  console.log('values=' + JSON.stringify(d.values));
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

