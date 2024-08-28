const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controller/auth'); 

// Login route
router.post('/', authController.login);

// Logout route
router.post('/logout',auth, authController.logOut);

module.exports = router;