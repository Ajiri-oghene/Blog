const express = require('express');
const router = express.Router();
// const Comment = require('../models/comment'); 
const auth = require('../middleware/auth'); 
const CommentController = require('../controller/comment'); 

// Create a new comment
router.post('/', auth, CommentController.createComment);

// Delete a comment
router.delete('/:id', auth, CommentController.deleteComment);

module.exports = router;
