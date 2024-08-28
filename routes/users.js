const express = require('express');
const router = express.Router();
const UserController = require('../controller/user');

router.post('/', UserController.createUser);

module.exports = router;