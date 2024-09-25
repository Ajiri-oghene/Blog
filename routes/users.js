const express = require('express');
const router = express.Router();
const UserController = require('../controller/user');

router.post('/', UserController.createUser);
router.post('/verify', UserController.verifyUser);

module.exports = router;