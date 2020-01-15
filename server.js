const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//write a middleware called uppercaser, that takes the name from the body and makes it Uppercase before its
//makes it to the request handler/router
//and only on POST and PUT

//build the echo mw, that will simply console.log the information in the body
/// write a gatekeeper mw, that reads a password from the headers, if the password is "mellon", let the request continue
// if the password is wrong, then return the status code 401 and an object like this { you: "cannot pass!" }

server.use(greeter);

//global middleware
server.use(express.json());
server.use(helmet());
server.use(morgan);
server.use(logger);
server.use(echo);
server.use(gateKeeper);

//cares only about requests beginning with /api/hubs (local)
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : '';

  res.send(`
  <h2>Lambda Hubs API</h2>
  <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});

//three amigas
function greeter(req, res, next) {
  res.status(200);
  res.json({ message: 'Hi there' });
}

function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log(`${method} to ${originalUrl}`);
  next();
}

function echo(req, res, next) {
  console.log(req.body);

  next();
}

function gateKeeper(req, res, next) {
  if (req.headers.password === 'mellon') {
    next();
  } else {
    res.status(401);
    res.json({ message: 'You shall not pass' });
  }
}

module.exports = server;
