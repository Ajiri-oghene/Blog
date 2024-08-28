const express = require('express');
const Post = require('../models/post');  
const auth = require('../middleware/auth');
const postController = require('../controller/post');
const router = express.Router();

// Create a new post
router.post('/', auth, postController.createPost);

// Read all posts by the authenticated user
router.get('/', auth, postController.getAllPost);

router.get('/:id', auth, postController.getPostById);


// Update a post by the authenticated user
router.patch('/:id', auth, postController.updatePost);

// Delete a post by the authenticated user
router.delete('/:id', auth, postController.deletePost)

module.exports = router;