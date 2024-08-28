const { User, validate } = require('../models/user');
const argon2 = require('argon2');
const _ = require('lodash');

exports.createUser =  async (req, res) => {
    // Validate the request body
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    // Check if the user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');
  
    // Create a new user with lodash to pick only the required properties
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
  
    // Hash the password with argon2
    try {
      user.password = await argon2.hash(user.password);
    } catch (err) {
      return res.status(500).send('Error while hashing the password.');
    }
  
    // Save the user to the database
    await user.save();
  
    // Generate an authentication token
    const token = user.generateAuthToken();
  
    // Send the response with the token in the header and the user in the body
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
};