const express = require('express');
const router = express.Router();
const Comment = require('../models/comment'); 
const Post = require('../models/post');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    const comment = new Comment({
      content,
      author: req.user._id,
      post: postId
    });

    await comment.save();

    // Add the comment ID to the post's comments array
    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id, author: req.user._id });

    if (!comment) {
      return res.status(404).send('Comment not found or not authorized.');
    }

    res.send('Comment has been deleted');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

