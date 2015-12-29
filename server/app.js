//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8080;

//We need a function which handles requests and send response
function handleRequest(request, response){
  console.log('It Works!! Path Hit: ' + request.url);
  console.log('It Works!! method Hit: ' + request.method);
  console.log('request body: ' + JSON.stringify(request.body));
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Request-Method', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET,PUT,POST,DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  if ( response.method === 'OPTIONS' ) {
    response.writeHead(200);
    response.end();
    return;
  }
  response.end('It Works!! Path Hit: ' + request.url);
 // response.header("Access-Control-Allow-Origin", "*");
 // response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
 // response.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s", PORT);
});
