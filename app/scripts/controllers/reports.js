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

    //owner,subject,category
    $scope.group = 'category';
    $scope.filter ='';
    $scope.catagory ='all';
    var categoryNames = ['all','efficiency', 'communication', 'culture', 'engagement'];
    var req = {
      method: 'GET',
      url: 'http://localhost:8080/api/report'
    }

    var records ={};
    $http(req).then(function (data) {
      //console.log('data='+JSON.stringify(data));
      records =data.data;
      chart(records, $scope.group,$scope.filter,$scope.catagory,categoryNames);
    }, function (data) {
      console.log('data error =' + JSON.stringify(data));
    });

    //http://bl.ocks.org/mbostock/3884955#data.tsv

    $scope.apply = function(){
      chart(records, $scope.group,$scope.filter,$scope.catagory,categoryNames);
    }

    function chart(data, group,filter,catagory,categorieNames) {
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
      d3.select("svg").remove();
      var svg = d3.select("#report").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      if (group === 'category') {
        color.domain(categoryNames);
      } else {
        color.domain(d3.keys(data[0]).filter(function (key) {
          return key === group;
        }));
      }
      var lines = {};
      data.forEach(function (d) {
        d.date = new Date(d.date);
        if (group === 'category') {
          categoryNames.forEach(function(cat){
            if (!lines[cat]) {
              lines[cat] = {name: cat, values: []};
            }
            lines[cat].values.push({date: d.date, rank: d[cat]});
          });
        } else {
          if(filter!==''){
            if(d[group]!==filter){
              console.log('d[group] ='+d[group]+', filter='+filter);
              return;
            }
            categoryNames.forEach(function(cat){
              if (!lines[cat]) {
                lines[cat] = {name: cat, values: []};
              }
              lines[cat].values.push({date: d.date, rank: d[cat]});
            });
            return;
          }
          if (!lines[d[group]]) {
            lines[d[group]] = {name: d[group], values: []};
          }
          lines[d[group]].values.push({date: d.date, rank: d[catagory]});
        }
      });
      var categories = [];
      Object.keys(lines).forEach(function (key) {
        //need to sum records for the same data
        var avgLine ={}
        lines[key].values.forEach(function (el){
          if(!avgLine[el.date]){
            avgLine[el.date] ={date:el.date,rank:0,values:[]};
          }
          avgLine[el.date].values.push(el.rank);
        });

        Object.keys(avgLine).forEach(function (k) {
          var avg =avgLine[k].values.reduce(function(sum, a) { return sum + a },0)/(avgLine[k].values.length||1);
          avgLine[k].rank =avg;
        });
        lines[key].values = Object.keys(avgLine).map(function(currentValue){
          return {date:avgLine[currentValue].date,rank:avgLine[currentValue].rank}
        });
        //sort
        lines[key].values.sort(function (a, b) {
          return a.date - b.date;
        });
        categories.push(lines[key]);
      });

      x.domain(d3.extent(data, function (d) {
        return new Date(d.date);
      }));

      y.domain([1,5]);

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

