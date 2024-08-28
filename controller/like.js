const express = require('express');
const Post = require('../models/post'); 


exports.likePost = async (req, res) => {
    try {
      // Find the post by ID
      const post = await Post.findById(req.params.id)
      .populate('author', 'name email');
      if (!post) return res.status(404).send('Post not found');
  
      const userId = req.user._id;
  
      // Check if the user has already liked the post
      const userIndex = post.likedBy.indexOf(userId);
  
      if (userIndex === -1) {
        // User has not liked the post yet, so like it
        post.likes += 1;
        post.likedBy.push(userId);
      } else {
        // User has already liked the post, so unlike it
        post.likes -= 1;
        post.likedBy.splice(userIndex, 1);  // Remove user from likedBy array
      }
  
      await post.save();
  
      // Populate the likedBy field to include user names and emails
      await post.populate('likedBy', 'name email');
  
      // Format the response to include the likedBy details
      const formattedPost = {
        _id: post._id,
        title: post.title,
        content: post.content,
        author: {
          _id: post.author._id,
          name: post.author.name,
          email: post.author.email
        },
        comments: post.comments,
        likes: post.likes,
        likedBy: post.likedBy.map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email
        })),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      };
  
      res.send(formattedPost);
    } catch (error) {
      console.error("Error during liking post:", error); // Log the error for debugging
      res.status(500).send('Server error');
    }
};