// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const { User } = require('../models/user');
// const config = require('config');
// const argon2 = require('argon2');

// // Nodemailer transporter configuration
// const transporter = nodemailer.createTransport({
//     service: config.get('email.service'),
//     host: config.get('email.host'),
//     port: config.get('email.port'),
//     secure: config.get('email.secure'), // true for 465, false for other ports
//     auth: {
//         user: config.get('email.user'), 
//         pass: config.get('email.password'),
//     },
// });

// exports.forgotPassword = async (req, res) => {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
    
//     if (!user) return res.status(400).send("User not found");

//     // Generate a reset token
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration

//     await user.save();

//     // Send email with the reset link
//     const resetUrl = `${config.get('clientUrl')}/reset-password?token=${resetToken}`;

//     const mailOptions = {
//         from: config.get('email.user'),
//         to: user.email,
//         subject: 'Password Reset',
//         html: `
//             <p>You requested a password reset. If this action wasn't initiated by you, kindly ignore this email.</p>
//             <p>Click the link below to reset your password:</p>
//             <a href="${resetUrl}">Reset Password</a>`,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.status(200).send('Password reset email sent.');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Error sending password reset email.');
//     }
// };

// exports.resetPassword = async (req, res) => {
//     const { token, newPassword } = req.body;

//     if (!newPassword) {
//         return res.status(400).send('New password is required.');
//     }

//     // Find user by reset token and check if token is expired
//     const user = await User.findOne({
//         resetPasswordToken: token,
//         resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
//     });

//     if (!user) return res.status(400).send('Invalid or expired token.');

//     // Hash the new password
//     try {
//         user.password = await argon2.hash(newPassword);
//     } catch (err) {
//         console.error('Error while hashing password:', err);
//         return res.status(500).send('Error while resetting the password.');
//     }

//     // Clear reset token fields
//     user.resetPasswordToken = null; // Use null instead of undefined
//     user.resetPasswordExpires = null; // Clear expiration field

//     await user.save();
//     res.status(200).send('Password successfully reset.');
// };


const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User } = require('../models/user');
const argon2 = require('argon2');
require('dotenv').config(); // Load environment variables

// Nodemailer transporter configuration using environment variables
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

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).send("User not found");

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration

    await user.save();

    // Send email with the reset link
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset',
        html: `
            <p>You requested a password reset. If this action wasn't initiated by you, kindly ignore this email.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Password reset email sent.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending password reset email.');
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).send('New password is required.');
    }

    // Find user by reset token and check if token is expired
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) return res.status(400).send('Invalid or expired token.');

    // Hash the new password
    try {
        user.password = await argon2.hash(newPassword);
    } catch (err) {
        console.error('Error while hashing password:', err);
        return res.status(500).send('Error while resetting the password.');
    }

    // Clear reset token fields
    user.resetPasswordToken = null; // Use null instead of undefined
    user.resetPasswordExpires = null; // Clear expiration field

    await user.save();
    res.status(200).send('Password successfully reset.');
};
