const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/login', AuthController.login);
router.post('/registro', AuthController.register);
// router.post('/logout', AuthController.logout);

module.exports = router;