const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const { clearCache } = require('../services/cache');

router.get('/blogs' , async(req , res) => {
    const blogs = await Blog.find().cache({key : 1});
    res.send(blogs);
});

router.post('/blogs' , async(req , res) => {
    const blog = await Blog.create(req.body);
    res.send(blog);
    clearCache(1);
})

module.exports = router;


