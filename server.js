var SERVER_PORT = process.env.PORT || 1337;

require('./public/scripts/object-extensions');

var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = app.io = require('socket.io').listen(server);

require('./app/app.js')(app);

app.use(express.static(__dirname + '/public'));

// Now we are configured let's start listening
server.listen(SERVER_PORT);
console.log("Server listening on port", SERVER_PORT);