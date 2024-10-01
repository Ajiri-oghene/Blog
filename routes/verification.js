
// const express = require('express');
// const router = express.Router();
// const config = require('config');
// const jwt = require('jsonwebtoken'); // Ensure jwt is imported
// const { User } = require('../models/user'); // Ensure User model is imported

// // Verification route
// router.get('/', async (req, res) => {
//   const { token } = req.query;

//   if (!token) {
//     return res.status(400).send('Invalid or missing token');
//   }

//   try {
//     const jwtPrivateKey = config.get('jwtPrivateKey');

//     // Verify the token and decode it
//     const decoded = jwt.verify(token, jwtPrivateKey);

//     // Find the user by the decoded user ID
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     if (user.isVerified) {
//       return res.status(400).send('User is already verified.');
//     }

//     // Mark user as verified
//     user.isVerified = true;
//     await user.save();

//     res.send('Email successfully verified!');
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       return res.status(400).send('Verification token has expired.');
//     } else if (error.name === 'JsonWebTokenError') {
//       return res.status(400).send('Invalid verification token.');
//     }
//     res.status(500).send('An error occurred during verification.');
//   }
// });

// module.exports = router;
