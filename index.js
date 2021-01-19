const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const routes = require('./routes/index');
const middleware = require('./middlewares/index');
require('./db');

server.set('port', 4000);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(middleware);
server.use(routes);

server.listen(server.get('port'), () => {
  console.log(`Server listening on http://localhost:${server.get('port')}/`);
});
