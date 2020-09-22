const express = require('express');
const postsRouter = express.Router();

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
  
    res.send({ message: 'hello from /posts!' });
    next();
    
});

postsRouter.get('/api/posts', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
      posts : posts
    });
});




module.exports =  postsRouter
