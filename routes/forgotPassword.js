const express = require('express');
const router = express.Router();
const PasswordController = require('../controller/forgotPassword');

// Route to request password reset
router.post('/', PasswordController.forgotPassword );

// Route to reset password
router.post('/reset', PasswordController.resetPassword);

module.exports = router;
