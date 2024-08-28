const express = require('express');
const Post = require('../models/post');  
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id
    });
    await post.save();
    res.status(201).send(post);
    console.log(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read all posts by the authenticated user
exports.getAllPost = async (req, res) => {
  try {
    // const posts = await Post.find({ author: req.user._id });
    const posts = await Post.find()
    .populate('author', 'name')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'author',  // Populate the author field of each comment
        select: 'name email'  // Include name and email of the comment author
      }
    }) 
    .sort('title');

    const formattedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      comments: {
        "total comments": post.comments.length,
        list: post.comments.map(comment => ({
          _id: comment._id,
          content: comment.content,
          authorName: comment.author.name,  // Include author name
          authorEmail: comment.author.email, // Include author email
          // Add or remove fields as needed
        }))
      },
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      // __v: post.__v,
    }));
    res.send(
      {
        number: formattedPosts.length,
        posts: formattedPosts
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getPostById = async (req, res) => {
  const _id = req.params.id;

  try {
    // Find the post by ID and populate the author and likes fields with the user names
    const post = await Post.findOne({ _id })
      .populate('author', 'name')  // Populating the author field with the name of the user

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    // Format the post in the desired order
    const formattedPost = {
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      comments: post.comments,
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    res.send(formattedPost);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};


// Update a post by the authenticated user
exports.updatePost = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'content'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user._id });

    if (!post) {
      return res.status(404).send();
    }

    updates.forEach((update) => (post[update] = req.body[update]));
    post.updatedAt = new Date(); 
    await post.save();

    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a post by the authenticated user
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id });

    if (!post) {
      return res.status(404).send("Not authorized to delete");
    }

    res.send("Post has been deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};
