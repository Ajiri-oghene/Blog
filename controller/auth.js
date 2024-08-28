const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const TokenBlacklist = require('../models/tokenBlacklist');
const Joi = require('joi');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// Login route
exports.login = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await argon2.verify(user.password, req.body.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();

  res.send({
    "user": user.name,
    "token": token
  });
};

// Logout route
exports.logOut = async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(400).send('Token is required for logout.');

  try {
    const blacklistedToken = new TokenBlacklist({ token });
    await blacklistedToken.save();
    res.send('Logged out successfully.');
  } catch (err) {
    res.status(500).send('Error logging out.');
  }
};

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}