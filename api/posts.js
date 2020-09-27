const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');
const { requireUser } = require('./utils');
const { createPost, updatePost, getPostById } = require('../db/index')

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;
  
    const tagArr = tags.trim().split(/\s+/)
    const postData = {};

    if (tagArr.length) {
      postData.tags = tagArr;
    }
  
    try {
        
        postData.authorId = req.user.id;
        postData.title = title;
        postData.content = content;

        const post = await createPost(postData);

        post ? res.send({post}) : next({error});
    } catch ({ name, message }) {
      next({ name, message });
    }
});


postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalPost = await getPostById(postId);
  
      if (originalPost.author.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);
        res.send({ post: updatedPost })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
});

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
      const post = await getPostById(req.params.postId);
  
      if (post && post.author.id === req.user.id) {
        const updatedPost = await updatePost(post.id, { active: false });
  
        res.send({ post: updatedPost });
      } else {
       
        next(post ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a post which is not yours"
        } : {
          name: "PostNotFoundError",
          message: "That post does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
});

postsRouter.get('/', async (req, res) => {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter(post => {
       
        if (post.active) {
          return true;
        }
      
        if (req.user && post.author.id === req.user.id) {
          return true;
        }
      
        return false;
    });
    res.send({ posts });
});

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
    res.send({ message: 'hello from /posts!' });
    next();
});

module.exports =  postsRouter
