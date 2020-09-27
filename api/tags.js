const { getAllTags, getPostsByTagName } = require("../db");
const express = require('express');
const tagsRouter = express.Router();
tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    const { tagName } = req.params;
    const postsByTag = await getPostsByTagName(tagName);

    try {
        postsByTag.filter(post => {
            if(post.active === false && post.author.id !== req.user.id){
                return false;
            }
        })
        
        
        res.send({
            posts : postsByTag
        });
      // use our method to get posts by tag name from the db
      // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
        next({ name, message });
    }
});
tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    res.send({ message: 'hello from /tags!' });
    next();

});
tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({ tags });
});


module.exports = tagsRouter