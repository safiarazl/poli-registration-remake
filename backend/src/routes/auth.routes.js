const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { loginSchema } = require('../validators/auth.validator');
const { verifyToken } = require('../middlewares/auth');

router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
