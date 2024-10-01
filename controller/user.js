// const { User, validate } = require('../models/user');
// const argon2 = require('argon2');
// const _ = require('lodash');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const config = require('config'); // Import config
// const expressAsyncHandler = require('express-async-handler');

// // Configure nodemailer transporter using config values
// const transporter = nodemailer.createTransport({
//   service: config.get('email.service'),
//   host: config.get('email.host'),
//   port: config.get('email.port'),
//   secure: config.get('email.secure'),
//   auth: {
//     user: config.get('email.user'),
//     pass: config.get('email.password'),
//   },
// });

// // Verify transporter setup
// transporter.verify((error) => {
//   if (error) {
//     console.log('Error with nodemailer setup:', error);
//   } else {
//     console.log('Nodemailer transporter is ready to send emails');
//   }
// });

// // Function to send verification email
// async function sendVerificationEmail(user) {
//   const jwtPrivateKey = config.get('jwtPrivateKey');
//   const clientUrl = config.get('clientUrl');

//   const token = jwt.sign({ userId: user._id }, jwtPrivateKey, {
//     expiresIn: '1h',
//   });

//   const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

//   const mailOptions = {
//     from: config.get('email.user'),
//     to: user.email,
//     subject: 'Email Verification',
//     html: `
//       <h2>Email Verification</h2>
//       <p>Click the link below to verify your email address:</p>
//       <a href="${verificationUrl}">Please verify</a>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Verification email sent to', user.email);
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//   }
// }

// // Registration route
// exports.createUser = async (req, res) => {
//   // Validate the request body
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   // Check if the user already exists
//   let user = await User.findOne({ email: req.body.email });
//   if (user) return res.status(400).send('User already registered.');


//   // Ensure isAdmin is handled correctly (convert string 'true'/'false' to boolean)
//   const isAdmin = req.body.isAdmin === 'true' || req.body.isAdmin === true;

//   // Create a new user with lodash to pick only the required properties
//   user = new User(_.pick(req.body, ['name', 'email', 'password', 'isVerified']));

//   // Set isAdmin explicitly
//   user.isAdmin = isAdmin;


//   // Hash the password with argon2
//   try {
//     user.password = await argon2.hash(user.password);
//   } catch (err) {
//     return res.status(500).send('Error while hashing the password.');
//   }

//   // Set isVerified to false initially
//   user.isVerified = false;

//   // Save the user to the database
//   await user.save();

//   // Send verification email
//   await sendVerificationEmail(user);

//   // Generate an authentication token
//   const token = user.generateAuthToken();

//   // Send the response with the token in the header and the user in the body
//   res
//     .header('x-auth-token', token)
//     .send({message:'User registered! Check your email to verify your account.', token});
// };


// exports.verifyUser = expressAsyncHandler(async(req, res, next)  => {
//   const {token} = req.query

//   if(!token){
//     res.status(400).json({message:"Token is required"})
//     return
//   }
//   const jwtPrivateKey = config.get('jwtPrivateKey');

//   const decode = jwt.verify(token, jwtPrivateKey)

//   if(!decode){
//     res.status(400).json({message:"Invalid jWT token. might have expired"})
//     return
//   }

//   // console.log(decode)

//   const userID = decode._id


//   const user = await  User.findById(userID)
//   if(!user){
//     res.status(404).json({message:"User not found or invalid token"})
//     return
//   }

//   console.log({userID, user})
//   user.isVerified = true
//   await user.save()
//   res.status(200).json({message:"User successfully verified"})
//   return
// })


const { User, validate } = require('../models/user');
const argon2 = require('argon2');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const expressAsyncHandler = require('express-async-handler');
require('dotenv').config(); // Load .env file

// Configure nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // Convert string to boolean
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter setup
transporter.verify((error) => {
  if (error) {
    console.log('Error with nodemailer setup:', error);
  } else {
    console.log('Nodemailer transporter is ready to send emails');
  }
});

// Function to send verification email
async function sendVerificationEmail(user) {
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
  const clientUrl = process.env.CLIENT_URL;

  const token = jwt.sign({ userId: user._id }, jwtPrivateKey, {
    expiresIn: '1h',
  });

  const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Email Verification',
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Please verify</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to', user.email);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

// Registration route
exports.createUser = async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  // Ensure isAdmin is handled correctly (convert string 'true'/'false' to boolean)
  const isAdmin = req.body.isAdmin === 'true' || req.body.isAdmin === true;

  // Create a new user with lodash to pick only the required properties
  user = new User(_.pick(req.body, ['name', 'email', 'password', 'isVerified']));

  // Set isAdmin explicitly
  user.isAdmin = isAdmin;

  // Hash the password with argon2
  try {
    user.password = await argon2.hash(user.password);
  } catch (err) {
    return res.status(500).send('Error while hashing the password.');
  }

  // Set isVerified to false initially
  user.isVerified = false;

  // Save the user to the database
  await user.save();

  // Send verification email
  await sendVerificationEmail(user);

  // Generate an authentication token
  const token = user.generateAuthToken();

  // Send the response with the token in the header and the user in the body
  res
    .header('x-auth-token', token)
    .send({message:'User registered! Check your email to verify your account.', token});
};

exports.verifyUser = expressAsyncHandler(async(req, res, next)  => {
  const {token} = req.query

  if(!token){
    res.status(400).json({message:"Token is required"})
    return
  }
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

  const decode = jwt.verify(token, jwtPrivateKey);

  if(!decode){
    res.status(400).json({message:"Invalid JWT token. It might have expired"});
    return;
  }

  const userID = decode.userId;

  const user = await User.findById(userID);
  if(!user){
    res.status(404).json({message:"User not found or invalid token"});
    return;
  }

  user.isVerified = true;
  await user.save();
  res.status(200).json({message:"User successfully verified"});
});
