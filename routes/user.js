const express = require('express');
const router = express.Router();
const passwordValidator = require('../middleware/passwordValidator');
const userController = require('../controllers/user');
const emailValidator = require('../middleware/emailValidator');

router.post('/signup', emailValidator, passwordValidator, userController.signup);
router.post('/login', userController.login);

module.exports = router;