const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce');
const authorize = require('../middleware/authorize');
const multer = require('../middleware/multer');

router.post('/', authorize, multer, sauceController.createSauce);
router.get('/:id', authorize, sauceController.getSauce);
router.get('/', authorize, sauceController.getAllSauces);

module.exports = router;