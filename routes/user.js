const express = require('express');
const router = express.Router();
const passwordValidator = require('../middleware/passwordValidator');
const userController = require('../controllers/user');

router.post('/signup', passwordValidator, userController.signup);
router.post('/login', userController.login);

module.exports = router;