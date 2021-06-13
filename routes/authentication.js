var express = require('express');
var router = express.Router();

// controller
const AuthController = require('../app/controllers/AuthController');

router.get('/login', AuthController.login);
router.post('/login', AuthController.login);

router.get('/signup', AuthController.signup);
router.post('/signup', AuthController.signup);

module.exports = router;
