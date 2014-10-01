var express = require('express');
var http = require('http');
var fs = require("fs");
var app = express();
var server = require('http').createServer(app);
var bodyParser   = require('body-parser');
var port;
var readFile = fs.readFileSync("ingredients.txt");


app.use(express.static("public", __dirname + "/public"))
app.use(bodyParser.json());


app.get('/', function(request, response) {
  response.sendfile(__dirname + '/index.html')
})

app.get('/data', function(request, response) {
  response.json(readFile.toString())
})

app.get('/getRecipes', function(request, response) {
  console.log(request.param('food'))
  var list = request.param('food')
  var mainIngredient;
  console.log(typeof list)
  if (typeof list == 'string') {
    mainIngredient = list
    console.log(mainIngredient)
  }
  else {
    mainIngredient = list[0]
  }
  var special = ''
  if (typeof list != 'string') {
    for (var i = 0; i<list.length; i++) {
      special += "&allowedIngredient[]=" + list[i];
    }
  }

  var body = ""

  http.get("http://api.yummly.com/v1/api/recipes?_app_id=9285586a&_app_key=d28d4c08b01a940f886faacc4a94e00b" + special + "&q=" + mainIngredient, function(resp){
    resp.on('data', function(chunk){
      body += chunk
    })
    resp.on('end', function() {
      response.send(JSON.parse(body))
    })
  }).on("error", function(e){
    console.log("Got error: " + e.message);
  });
})


port = process.env.PORT || 5000;

server.listen(port, function () {
    console.log('OOTD server listening on port 5000');
});