const PORT = 3000;
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const { client } = require('./db');
client.connect();

server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
});


const apiRouter = require('./api');
server.use('/api', apiRouter);

server.get('/api/posts', async (req, res, next) => {
    console.log('this is firing');
    return
});

server.get('/api/tags', async (req, res, next) => {
    console.log('this is firing');
    return
});

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});