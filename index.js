const { PORT = 3000 } = process.env
const express = require('express');
const server = express();

require('dotenv').config();
const morgan = require('morgan');
server.use(morgan('dev'));

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const apiRouter = require('./api');
server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();


server.get('/background/:color', (req, res, next) => {
  res.send(`
    <body style="background: ${ req.params.color };">
      <h1>Hello World</h1>
    </body>
  `);
});

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");
  
  next();
});
apiRouter.use((error, req, res, next) => {
  res.send(error);
});
server.get('*', (req, res, next) => {
    res.status(404).send('Oops! :(');
});
server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});









