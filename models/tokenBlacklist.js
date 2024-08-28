const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h'  // Tokens will automatically be removed after 1 hour
    // If you want token to expire in 10 minutes use 10m 
     // If you want token to expire in 10 seconds use 10s
  }
});

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;
