var SERVER_PORT = process.env.PORT || 1337;

var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app);

app.use(express.static(__dirname + '/public'));

// Now we are configured let's start listening
server.listen(SERVER_PORT);
