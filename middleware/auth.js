// const jwt = require('jsonwebtoken');
// const config = require('config');
// const TokenBlacklist = require('../models/tokenBlacklist'); 

// async function auth(req, res, next) {
//   const token = req.header('x-auth-token');
//   if (!token) return res.status(401).send('Access denied. No token provided.');

//   const isBlacklisted = await TokenBlacklist.findOne({ token });
//   if (isBlacklisted) return res.status(401).send('Invalid token.');

//   try {
//     const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
//     req.user = decoded;
//     next();
//   } catch (ex) {
//     res.status(400).send('Invalid token.');
//   }
// }

// module.exports = auth;


const jwt = require('jsonwebtoken');
const config = require('config');
const TokenBlacklist = require('../models/tokenBlacklist');
const { User } = require('../models/user');

async function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  // Check if the token is blacklisted
  const isBlacklisted = await TokenBlacklist.findOne({ token });
  if (isBlacklisted) return res.status(401).send('Invalid token.');

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;

    // Fetch the user from the database
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('User not found.');

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res.status(403).send('Email not verified. Please verify your email to proceed.');
    }

    // If everything is valid, proceed to the next middleware
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}

module.exports = auth;
