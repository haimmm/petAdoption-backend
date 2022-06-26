//express
const express = require('express');
const router = express.Router();

//schema
const validator = require('../middlewares/DTOvalidator');
const registerSchema = require('../DTO/auth/register-schema');
const loginSchema = require('../DTO/auth/login-schema');

const authController = require("../controllers/auth.controller.js");

router.post('/register', validator(registerSchema), authController.register);
router.post('/login', validator(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
module.exports = router;