//Lets require/import the HTTP module
var http = require('http');
var express = require('express');
var fs = require('fs');
var readline = require('readline');
//Lets define a port we want to listen to
const PORT = 9000;

var app = express();

app.set('port', (process.env.PORT || PORT));

if(process.argv[2]){
  app.set('port', process.argv[2]);
}
//app.use(express.static(__dirname + '/app'));
app.use('/', express.static('app'));
app.use('/bower_components', express.static('bower_components'));

app.post('/api/save', function (request, response) {
  var body = '';
  request.on('data', function (data) {
    body += data;
  });
  request.on('end', function () {
    //need to write to file
    fs.appendFile('survey.json', body + '\n', function (err) {
      if (err) return console.log(err);
      console.log('survey.json, body=' + body);
    })
  });
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end('post received');
});


app.get('/api/report', function (request, response) {
  var result = [];
  var rd = readline.createInterface({
    input: fs.createReadStream('survey.json'),
    output: process.stdout,
    terminal: false
  });

  rd.on('line', function (line) {
    result.push(line);
  });
  rd.on('close', function (line) {
    // console.log('result='+result);
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end('[' + result + ']');
  });
});

app.get('/api/survey-hints', function (request, response) {
  var result = {owners:[],subjects:[]};
  var rd = readline.createInterface({
    input: fs.createReadStream('survey.json'),
    output: process.stdout,
    terminal: false
  });

  rd.on('line', function (line) {
    var survey = JSON.parse(line);
    if(result.owners.indexOf(survey.owner)<0){
      result.owners.push(survey.owner);
    }
    if(result.subjects.indexOf(survey.subject)<0){
      result.subjects.push(survey.subject);
    }

  });
  rd.on('close', function (line) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(result, null, 3));
  });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});


//We need a function which handles requests and send response
function handleRequest(request, response) {
  console.log('It Works!! Path Hit: ' + request.url);
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Request-Method', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET,PUT,POST,DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  if (response.method === 'OPTIONS') {
    response.writeHead(200);
    response.end();
    return;
  } else if (request.method == 'POST' && request.url === '/api/save') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      //need to write to file
      fs.appendFile('survey.json', body + '\n', function (err) {
        if (err) return console.log(err);
        console.log('survey.json, body=' + body);
      })
    });
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('post received');
  } else if (request.method == 'GET' && request.url === '/api/report') {
    var result = [];
    var rd = readline.createInterface({
      input: fs.createReadStream('survey.json'),
      output: process.stdout,
      terminal: false
    });

    rd.on('line', function (line) {
      result.push(line);
    });
    rd.on('close', function (line) {
      // console.log('result='+result);
      response.writeHead(200, {"Content-Type": "application/json"});
      response.end('[' + result + ']');
    });
  } else {
    response.end('It Works!! Path Hit: ' + request.url);
  }
}


//Create a server
//var server = http.createServer(handleRequest);

//Lets start our server
/*
 server.listen(PORT, function () {
 //Callback triggered when server is successfully listening. Hurray!
 console.log("Server listening on: http://localhost:%s", PORT);
 });
 */
