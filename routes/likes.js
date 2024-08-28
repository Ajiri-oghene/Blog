const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const likeController = require('../controller/like'); 


// Route to like or unlike a post
router.post('/:id', auth, likeController.likePost);


module.exports = router;