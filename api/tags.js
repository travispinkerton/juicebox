const {getAllTags} = require("../db/index");
const express = require('express');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");
  
    res.send({ message: 'hello from /tags!' });
    next();
    
});

tagsRouter.get('/api/tags', async (req, res) => {
    const tags = await getAllTags();

    res.send({
      tags : tags
    });
});

module.exports = tagsRouter