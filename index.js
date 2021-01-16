const express = require('express');
const bodyParser = require('body-parser');
const server = express();
require('./db');

server.set('port', 4000);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('/', (req, res) => {
  res.send("Hi, You're in node js");
});

server.listen(server.get('port'), () => {
  console.log(`Server listening on http://localhost:${server.get('port')}/`);
});
