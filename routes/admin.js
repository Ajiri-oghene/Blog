const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const auth = require('../middleware/auth'); // Middleware for authentication
const admin = require('../middleware/isAdmin'); // Middleware to check if the user is admin

// Make user an admin route
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).send('User not found.');
    
    // Check if the user is already an admin
    if (user.isAdmin) return res.status(400).send('User is already an admin.');

    // Update the user's isAdmin field
    user.isAdmin = true;
    await user.save();

    res.send(`User ${user.name} has been made an admin.`);
  } catch (error) {
    res.status(500).send('An error occurred while making the user an admin.');
  }
});

module.exports = router;
